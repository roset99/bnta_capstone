package com.horror_scope.demo.monthlyHorrorScopes;

import com.horror_scope.demo.exception.Exceptions;
import com.horror_scope.demo.horrorscope.HorrorScope;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MonthlyHorrorScopeService {
    
    private final MonthlyHorrorScopeDAO monthlyHorrorScopeDAO;
    
    public MonthlyHorrorScopeService(MonthlyHorrorScopeDAO monthlyHorrorScopeDAO) {
        this.monthlyHorrorScopeDAO = monthlyHorrorScopeDAO;
    }
    
    public List<MonthlyHorrorScope> getMonthlyHorrorScope() {
        return monthlyHorrorScopeDAO.selectMonthlyHorrorScope();
    }

    public MonthlyHorrorScope getMonthlyHorrorScope (String zodiacSign) {
        return monthlyHorrorScopeDAO.selectMonthlyHorrorScopeByZodiacSign(zodiacSign)
                .orElseThrow(() -> new Exceptions(String.format("Monthly Horrorscope with zodiac sign %s not found", zodiacSign)));
    }

}
