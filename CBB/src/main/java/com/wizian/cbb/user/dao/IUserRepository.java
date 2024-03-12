package com.wizian.cbb.user.dao;

import org.apache.ibatis.annotations.Param;

import com.wizian.cbb.user.model.UserVO;

public interface IUserRepository {
	UserVO selectUser(@Param("loginId") String loginId);

	void updateRcntLoginDt(@Param("loginId") String loginId);

	void updatePswdErrCnt(@Param("loginId") String loginId);
	
	void updateUserCloseYn(@Param("loginId") String loginId, @Param("userCloseYn") String userCloseYn );
}
