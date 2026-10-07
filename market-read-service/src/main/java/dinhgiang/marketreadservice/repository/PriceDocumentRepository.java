package dinhgiang.marketreadservice.repository;

import dinhgiang.marketreadservice.dto.PriceDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PriceDocumentRepository extends MongoRepository<PriceDocument, String> {
}
