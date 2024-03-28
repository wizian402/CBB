package com.wizian.cbb.tng.stdnt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wizian.cbb.tng.bzenty.model.TngVO;
import com.wizian.cbb.tng.stdnt.service.IStdntAplyService;

@RestController
public class StdntAplyController {

	@Autowired
	IStdntAplyService stdntAplyService;

	@PostMapping("/tng/stdntAly")
	public @ResponseBody List<TngVO> stdntAly() {
		List<TngVO> tempList = stdntAplyService.selectProcTng();
		return tempList;
	}

	@PostMapping("/tng/stdntAplyTng")
	public ResponseEntity<String> stdntAplyTng(@RequestBody String aplyData) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, String> alpyMap = objectMapper.readValue(aplyData, new TypeReference<Map<String, String>>() {
			});
			String loginId = alpyMap.get("loginId");
			int tngNo = Integer.parseInt(alpyMap.get("tngNo"));
			Map<String, Object> tempMap = stdntAplyService.selectStndtSn(loginId);

			int stdntSn = Integer.parseInt(String.valueOf(tempMap.get("stdntSn")));
			List<Map<String, Object>> sttsList = stdntAplyService.getTngStdnt(stdntSn);
			for (Map<String, Object> stts : sttsList) {
				String tngProgStts = String.valueOf(stts.get("tngPrgrsStts"));
				if (tngProgStts.equals("30")) {
					return ResponseEntity.ok("exist");
				} else if(tngProgStts.equals("20")) {
					return ResponseEntity.ok("exist2");
				}
			}
			if (stdntAplyService.countTngStdnt(tngNo, stdntSn) != 0) {
				return ResponseEntity.ok("fail");
			} else {
				stdntAplyService.stdntAplyTng(tngNo, stdntSn);
				return ResponseEntity.ok("success");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
		}

	}

	@PostMapping("/tng/checkTngStdnt")
	public ResponseEntity<String> checkTngStdnt(@RequestBody String loginData) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, String> loginMap = objectMapper.readValue(loginData, new TypeReference<Map<String, String>>() {
			});
			String loginId = loginMap.get("loginId");
			Map<String, Object> tempMap = stdntAplyService.selectStndtSn(loginId);
			int stdntSn = Integer.parseInt(String.valueOf(tempMap.get("stdntSn")));

			List<Map<String, Object>> sttsList = stdntAplyService.getTngStdnt(stdntSn);
			for (Map<String, Object> stts : sttsList) {
				String tngProgStts = String.valueOf(stts.get("tngPrgrsStts"));
				if (tngProgStts.equals("30")) {
					return ResponseEntity.ok("exist");
				}
			}
		} catch (Exception e) {
		}
		return null;
	}

}
