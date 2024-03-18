package com.wizian.cbb.consulting.service;

import java.util.List;

import com.wizian.cbb.consulting.model.ConItemVO;
import com.wizian.cbb.consulting.model.ResultVO;
import com.wizian.cbb.consulting.model.SchedulePrintVO;
import com.wizian.cbb.consulting.model.ScheduleVO;

public interface IConsultingService {
	public List<ConItemVO> Consultationitems();
	public int itemInsert(ConItemVO conItemsVO);
	public int itemUpdate(ConItemVO conItemsVO);
	public int itemDelete(String itemId);
	public String itemCheck(ConItemVO conItemsVO);
	
	
	
	public List<SchedulePrintVO> adminSchedulesList();
	
	
	public int insertSchedule(ScheduleVO scheduleVO);
	
	
	
	public List<ResultVO> resultList();
	}
