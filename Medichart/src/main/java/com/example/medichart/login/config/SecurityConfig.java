package com.example.medichart.login.config;

import com.example.medichart.login.service.AdminUserService;
import com.example.medichart.login.service.OauthUserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Set;

@Configuration
public class SecurityConfig {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private OauthUserService oauthUserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrf) -> csrf.disable())
                .authorizeHttpRequests((auth) -> auth //"/signup",
                        .requestMatchers("/", "/oauth2/**", "/login/**", "/signup", "/css/**", "/js/**","/upload", "/translate",
                                "/findid", "/findpassword", "/verify", "/verifypassword","/admin/**","/admin/dashboard","/admin/notices","/list","/new","/edit","/delete").permitAll()
                        .requestMatchers("/admin/**","/admin/dashboard","/admin/notices","/list","/new","/edit","/delete").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .oauth2Login((auth) -> auth
                        .loginPage("/login")
                        .userInfoEndpoint(userInfoEndpointConfig ->
                                userInfoEndpointConfig.userService(oauthUserService)))
                .formLogin((form) -> form
                        .loginPage("/login")
                        .successHandler(successHandler())
                        .permitAll())
                .logout((logout) -> logout
                        .permitAll());

        return http.build();
    }
    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                                Authentication authentication) throws IOException, ServletException {
                Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
                if (roles.contains("ROLE_ADMIN")) {
                    response.sendRedirect("/admin/dashboard");
                } else {
                    response.sendRedirect("/dashboard");
                }
            }
        };
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return adminUserService;
    }
}