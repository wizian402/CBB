package com.wizian.cbb.tng.updateTng.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizian.cbb.tng.updateTng.dao.ITngScheduledRepository;

@Service
public class TngScheduledService implements ITngScheduledService {

	@Autowired
	ITngScheduledRepository tngScheduledRepository;
	
	@Override
	public List<Map<String, Object>> selectTng() {
		return tngScheduledRepository.selectTng();
	}

	@Override
	public void updateTngStts(String tngNo) {
		tngScheduledRepository.updateTngStts(tngNo);
	}

	@Override
	public void updateTngStdntStts(int tngAplyNo) {
		tngScheduledRepository.updateTngStdntStts(tngAplyNo);
	}

}
