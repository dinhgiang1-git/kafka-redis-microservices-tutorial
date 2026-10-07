package dinhgiang.marketreadservice.service;

import dinhgiang.marketreadservice.dto.PriceDocument;
import dinhgiang.marketreadservice.repository.PriceDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.yaml.snakeyaml.emitter.Emitter;
import tools.jackson.databind.json.JsonMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class PriceService {
    private final StringRedisTemplate redisTemplate;
    private final PriceDocumentRepository priceDocumentRepository;
    private final JsonMapper jsonMapper;

    private final List<SseEmitter> emitters = new ArrayList<>();

    //Hàm cho client đăng ký nghe giá
    public SseEmitter subscribe() {
        // 0L = giữ kết nối vĩnh viễn, không timeout
        SseEmitter emitter = new SseEmitter(0L);

        emitters.add(emitter);

        //Khi client tắt tab hoặc tắt mạng -> xoá khỏi danh sách
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        log.info("Client mới kết nối SSE! Tổng client đang nghe {}", emitters.size());
        return emitter;
    }

    @Scheduled(fixedRate = 1000)
    public void boardCastPrices() {
        if (emitters.isEmpty()) {
            return;
        }

        //Lấy danh sách giá mới nhất
        List<PriceDocument> priceDocuments = getPrices();

        //Bắn giá tới từng client
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("price-update")
                        .data(priceDocuments)
                );
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }

    //1. Lấy giá 1 đồng coin
    public PriceDocument getPrice(String symbol) {
        String key = "market:price:" + symbol;

        try {
            //Tìm trong redis trước
            String cacheJson = redisTemplate.opsForValue().get(key);
            if (cacheJson != null) {
                log.info("CACHE HIT: Lấy giá trị từ redis cho {}", symbol);
                return jsonMapper.readValue(cacheJson, PriceDocument.class);
            }
        } catch (Exception e) {
            log.warn("Redis gặp lỗi, chuyển sang được MongoDB: {}", e.getMessage());
        }

        //Nếu redis không có, đọc từ DB
        log.info("Cache MISS: Đọc giá trị từ MongoDB cho {}", symbol);
        return priceDocumentRepository.findById(symbol).orElse(null);
    }

    public List<PriceDocument> getPrices() {
        Set<String> keys = redisTemplate.keys("market:price:*");
        try {
            //Tìm tất cả key "market:price:*"
            if (keys != null && !keys.isEmpty()) {
                List<String> jsonList = redisTemplate.opsForValue().multiGet(keys);
                if (jsonList != null) {
                    List<PriceDocument> result = new ArrayList<>();
                    for (String json : jsonList) {
                        if (json != null) {
                            result.add(jsonMapper.readValue(json, PriceDocument.class));
                        }
                        log.info("CACHE HIT: Lấy giá trị từ redis cho {}", keys);
                    }
                    return result;
                }
            }
        } catch (Exception e) {
            log.warn("Redis gặp lỗi, chuyển sang được MongoDB: {}", e.getMessage());
        }
        log.info("Cache MISS: Đọc giá trị từ MongoDB cho {}", keys);
        return priceDocumentRepository.findAll();
    }
}
