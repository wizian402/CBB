package com.wizian.wlms.consulting.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.wizian.wlms.consulting.model.ConItemVO;

public interface IConsultingRepository {
	public List<ConItemVO> Consultationitems();
	public int itemInsert(ConItemVO conItemsVO);
	public int itemUpdate(ConItemVO conItemsVO);
	public int itemDelete(@Param("itemId") String itemId);
	public String itemCheck(ConItemVO conItemsVO);
}
