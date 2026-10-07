package dinhgiang.pricewriteservice;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import tools.jackson.databind.json.JsonMapper;

@SpringBootApplication
public class PriceWriteServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PriceWriteServiceApplication.class, args);
    }

    @Bean
    public NewTopic market() {
        return TopicBuilder.name("market.price")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public JsonMapper jsonMapper() {
        return JsonMapper.builder().build();
    }

}
