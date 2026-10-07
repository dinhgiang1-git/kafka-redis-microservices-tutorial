package dinhgiang.marketsimulator.service;

import dinhgiang.marketsimulator.dto.Coin;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class PriceGenerator {
    private final BigDecimal MIN_PRICE = new BigDecimal("0.000001");
    private final Map<String, Coin> coins = new HashMap<>();
    private static final int MAX_CHANGE_BPS = 100; //100 basis points = 1%

    public PriceGenerator() {
        coins.put("BTC/USDT", new Coin(new BigDecimal("65000")));
        coins.put("ETH/USDT", new Coin(new BigDecimal("3500")));
        coins.put("BNB/USDT", new Coin(new BigDecimal("600")));
        coins.put("SOL/USDT", new Coin(new BigDecimal("150")));
        coins.put("XRP/USDT", new Coin(new BigDecimal("0.55")));
    }

    public List<String> symbols() {
        return List.copyOf(coins.keySet());
    }

    public Coin nextPrice(String symbol) {
        Coin coin = coins.get(symbol);
        if (coin == null) {return null;}

        int basisPoints = ThreadLocalRandom.current().nextInt(-MAX_CHANGE_BPS, MAX_CHANGE_BPS + 1);
        BigDecimal changeRate = BigDecimal.valueOf(basisPoints).divide(BigDecimal.valueOf(10_000));
        BigDecimal updatePrice = coin.getPrice()
            .multiply(BigDecimal.ONE.add(changeRate))
            .max(MIN_PRICE)
            .setScale(6, RoundingMode.HALF_UP);

        coin.setPrice(updatePrice);
        coin.setSequence(coin.getSequence() == null ? 1L : coin.getSequence() + 1L);
        return coin;
        }
}
