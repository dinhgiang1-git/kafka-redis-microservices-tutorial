package dinhgiang.marketsimulator.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coin {
    private BigDecimal initialPrice;
    private BigDecimal price;
    private Long sequence;

    public Coin(BigDecimal initialPrice) {
        this.initialPrice = initialPrice;
        this.price = initialPrice;
        this.sequence = 0L;
    }
}
