package dinhgiang.marketreadservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import tools.jackson.databind.json.JsonMapper;

@SpringBootApplication
@EnableScheduling
public class MarketReadServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketReadServiceApplication.class, args);
    }

    @Bean
    public JsonMapper jsonMapper() {
        return JsonMapper.builder().build();
    }

}
