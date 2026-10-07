package dinhgiang.marketsimulator;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MarketSimulatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketSimulatorApplication.class, args);
    }

    @Bean
    public NewTopic marketPrices() {
        return TopicBuilder.name("market.price")
                .partitions(3)
                .replicas(1)
                .build();
    }

}
