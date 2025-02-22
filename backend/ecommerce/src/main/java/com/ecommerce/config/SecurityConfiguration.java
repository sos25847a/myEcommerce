package com.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;


@Configuration
public class SecurityConfiguration {
    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        //保護/api/orders
        httpSecurity.authorizeHttpRequests(requests ->
                requests
                        .requestMatchers("/api/orders/**")//保護指定路徑
                        .authenticated()// 需要身份驗證
                        .anyRequest().permitAll()) // 其他請求不受限制

                //這裡設置了Spring Security使用OAuth2.0來保護API，
                //並且使用JWT進行資源伺服器的驗證。這樣的設置確保只有經過身份驗證的用戶才能訪問受保護的資源
                .oauth2ResourceServer(oauth2ResourceServer -> oauth2ResourceServer
                .jwt(Customizer.withDefaults()));
        //CORS過濾器
        //開啟 CORS 支援，這樣可以允許來自不同域的請求
        httpSecurity.cors(Customizer.withDefaults());

        //設置內容傳送策略，設定返回的內容類型
        httpSecurity.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        //集成 Okta 的配置
        //未經授權時（例如，未登入），返回的 401 響應的內容
        Okta.configureResourceServer401ResponseBody(httpSecurity);

        //禁用了CSRF保護
        httpSecurity.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable());

        //HttpSecurity 支援 Builder 設計模式，因此我們可以「build it」來傳回實例
        //通過 build() 方法構建並返回 SecurityFilterChain 實例
        return httpSecurity.build();
    }
}
