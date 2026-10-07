package dinhgiang.marketreadservice.controller;

import dinhgiang.marketreadservice.dto.PriceDocument;
import dinhgiang.marketreadservice.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("api/prices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PriceController {
    private final PriceService priceService;

    @GetMapping("/{base}/{quote}")
    public ResponseEntity<PriceDocument> getPrice(@PathVariable String base, @PathVariable String quote) {
        String symbol = base + "/" + quote;
        PriceDocument price = priceService.getPrice(symbol);

        if (price == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(price);
    }

    @GetMapping()
    public ResponseEntity<List<PriceDocument>> getAllPrices() {
        return ResponseEntity.ok(priceService.getPrices());
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamPrices() {
        return priceService.subscribe();
    }
}
