package com.wizian.cbb.tng.admin.service;

import java.util.List;
import java.util.Map;

import com.wizian.cbb.tng.bzenty.model.TngVO;

public interface IAdmPerService {
	List<TngVO> selectAllTng();
	
	List<Map<String, Object>> selectBzentyNm();
}
