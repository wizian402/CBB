package com.wizian.cbb.consulting.model;

public class ProcessingVO {
	private String scheduleId;
	private String reservationId;	
	private String studentId;
	private String student;
	private String consultationDate;
	private String consultationTime;
	private String creationDate;
	private String counselor;
	private String item;
	public String getScheduleId() {
		return scheduleId;
	}
	public void setScheduleId(String scheduleId) {
		this.scheduleId = scheduleId;
	}
	public String getReservationId() {
		return reservationId;
	}
	public void setReservationId(String reservationId) {
		this.reservationId = reservationId;
	}
	public String getStudentId() {
		return studentId;
	}
	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}
	public String getStudent() {
		return student;
	}
	public void setStudent(String student) {
		this.student = student;
	}
	public String getConsultationDate() {
		return consultationDate;
	}
	public void setConsultationDate(String consultationDate) {
		this.consultationDate = consultationDate;
	}
	public String getConsultationTime() {
		return consultationTime;
	}
	public void setConsultationTime(String consultationTime) {
		this.consultationTime = consultationTime;
	}
	public String getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}
	public String getCounselor() {
		return counselor;
	}
	public void setCounselor(String counselor) {
		this.counselor = counselor;
	}
	public String getItem() {
		return item;
	}
	public void setItem(String item) {
		this.item = item;
	}
	
	@Override
	public String toString() {
		return "ProcessingVO [scheduleId=" + scheduleId + ", reservationId=" + reservationId + ", studentId="
				+ studentId + ", student=" + student + ", consultationDate=" + consultationDate + ", consultationTime="
				+ consultationTime + ", creationDate=" + creationDate + ", counselor=" + counselor + ", item=" + item
				+ "]";
	}
	
	
	
	
	
	

}
