package dinhgiang.pricewriteservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Coin {
    private BigDecimal initialPrice;
    private BigDecimal price;
    private Long sequence;
}
