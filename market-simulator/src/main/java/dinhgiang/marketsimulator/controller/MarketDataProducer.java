package dinhgiang.marketsimulator.controller;

import dinhgiang.marketsimulator.service.PriceGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

@Component
@Slf4j
@RequiredArgsConstructor
public class MarketDataProducer {
    private final String TOPIC = "market.price";
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final JsonMapper jsonMapper;

    private final PriceGenerator priceGenerator;

    @Scheduled(
            fixedDelay = 1000,
            initialDelay = 1000
    )
    public void publishPrices() {
        for (String symbol : priceGenerator.symbols()) {
            String json = jsonMapper.writeValueAsString(priceGenerator.nextPrice(symbol));
            kafkaTemplate.send(TOPIC, symbol, json).whenComplete((result, error) -> {
                if (error != null) {
                    log.error("Error while sending data to topic " + TOPIC, error);
                } else {
                    log.info("Data published {} to topic {}: {}", symbol,TOPIC, json);
                }
            });
        }
    }
}
