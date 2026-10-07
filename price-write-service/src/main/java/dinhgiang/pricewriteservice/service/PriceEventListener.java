package dinhgiang.pricewriteservice.service;

import dinhgiang.pricewriteservice.dto.Coin;
import dinhgiang.pricewriteservice.dto.PriceDocument;
import dinhgiang.pricewriteservice.repository.PriceDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;
import java.time.Instant;

@Service
@Component
@RequiredArgsConstructor
@Slf4j
public class PriceEventListener {
    private final PriceDocumentRepository priceDocumentRepository;
    private final JsonMapper jsonMapper;
    private final RedisTemplate<String, String> redisTemplate;
    @Value("${app.redis.price-ttl-seconds}")
    private Long priceTTLSeconds;

    @KafkaListener(topics = "market.price")
    public void onPriceReceived(ConsumerRecord<String, String> record, Acknowledgment ack) {
        String symbol = record.key();
        String json = record.value();

        try {
            //chuyển đổi json thành coin
            Coin coin = jsonMapper.readValue(json, Coin.class);

            //Tạo document để lưu, cập nhật MongoDB
            PriceDocument priceDocument = PriceDocument.builder()
                    .symbol(symbol)
                    .initialPrice(coin.getInitialPrice())
                    .price(coin.getPrice())
                    .sequence(coin.getSequence())
                    .updateAt(Instant.now())
                    .build();

            priceDocumentRepository.save(priceDocument);

            //Cập nhật vào Redis Cache
            String priceDocumentJson = jsonMapper.writeValueAsString(priceDocument);
            redisTemplate.opsForValue().set("market:price:" + symbol, priceDocumentJson, Duration.ofSeconds(priceTTLSeconds));

            log.info("Saved to mongoDB & Redis: symbol={} price={}, sequence={}", symbol, coin.getPrice(), coin.getSequence());

            //Xác nhận đã xử lí xong message
            ack.acknowledge();

        } catch (Exception e) {
            log.error("Failed to process mess for symbol{}", symbol, e);
        }
    }
}
