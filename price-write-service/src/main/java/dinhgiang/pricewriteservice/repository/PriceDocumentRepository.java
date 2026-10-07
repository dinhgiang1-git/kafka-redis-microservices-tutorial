package dinhgiang.pricewriteservice.repository;

import dinhgiang.pricewriteservice.dto.PriceDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PriceDocumentRepository extends MongoRepository<PriceDocument, String> {

}
