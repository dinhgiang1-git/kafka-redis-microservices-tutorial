package dinhgiang.pricewriteservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(collection = "prices")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PriceDocument {
    @Id
    private String symbol;

    private BigDecimal initialPrice;
    private BigDecimal price;
    private Long sequence;
    private Instant updateAt;
}
