package com.horror_scope.demo.HorrorScope;

import com.horror_scope.demo.horrorscope.HorrorScope;
import com.horror_scope.demo.horrorscope.HorrorScopeDataAccessService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class HorrorScopeDataAccessServiceTest {

    @Autowired private JdbcTemplate jdbcTemplate;
    private HorrorScopeDataAccessService underTest;

    @BeforeEach
    void setup(){
        underTest = new HorrorScopeDataAccessService(jdbcTemplate);
        jdbcTemplate.execute("INSERT INTO descriptions(zodiacSign, zodiacIcon, zodiacIconDark, zodiacImage, zodiacImageDark, zodiacBackground, personality, positiveMatch, negativeMatch, deathPredictions, romance, family, money, career) VALUES('aries', 'icon', 'iconDark', 'image', 'imageDark', 'background', 'happy', 'taurus', 'gemini', 'death', 'yes', 'no', 'little', 'over');");
    }



//    @Test
//    void selectHorrorScopes() {
//        List<HorrorScope> actual = underTest.selectHorrorScopes();
//        List<HorrorScope> expected = List.of(new HorrorScope("aries", "icon", "iconDark", "image", "imageDark", "background", "happy", "taurus", "gemini", "death", "yes", "no", "little", "over"));
//
//        assertThat(actual).isEqualTo(expected);
//    }

    @Test
    void selectHorrorScopeByZodiacSign() {
    }
}