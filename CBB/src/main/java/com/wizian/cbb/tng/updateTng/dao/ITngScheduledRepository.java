package com.wizian.cbb.tng.updateTng.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface ITngScheduledRepository {
	List<Map<String, Object>> selectTng();

	void updateTngStts(@Param("tngNo") String tngNo);

	void updateTngStdntStts(@Param("tngAplyNo") int tngAplyNo);
}
