package com.wizian.cbb.tng.updateTng.component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.wizian.cbb.tng.updateTng.service.ITngScheduledService;

@Component
@EnableScheduling
public class TngScheduled {

	@Autowired
	ITngScheduledService tngScheduledService;

	@Scheduled(cron = "0 0 0 * * ?")
	public void tngUpdateDaily() {
	    List<Map<String, Object>> tngList = tngScheduledService.selectTng();
	    for (Map<String, Object> tng : tngList) {
	        String tngNo = tng.get("tngNo").toString();
	        String tngStYmd = tng.get("tngStYmd").toString();
	        int tngAplyNo = Integer.parseInt(tng.get("tngAplyNo").toString());
	        System.out.println(tngStYmd);

	        // tngStYmd가 오늘의 날짜와 같은지 확인하는 조건 추가
	        LocalDate today = LocalDate.now();
	        LocalDate tngStYmdDate = LocalDate.parse(tngStYmd, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	        
	        System.out.println(today);
	        System.out.println(tngStYmdDate);
	        
	        if (tngStYmdDate.equals(today)) {
	            // tngStYmd가 오늘의 날짜와 같으면 해당 작업을 실행
	            tngScheduledService.updateTngStdntStts(tngAplyNo);
	            tngScheduledService.updateTngStts(tngNo);
	        }
	    }
	}

}
