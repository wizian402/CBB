package com.wizian.cbb.tng.updateTng.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface ITngScheduledService {
	List<Map<String, Object>> selectTng();

	void updateTngStts(String tngNo);

	void updateTngStdntStts(int tngAplyNo);
}
