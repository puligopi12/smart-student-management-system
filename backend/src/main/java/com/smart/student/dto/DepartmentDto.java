package com.smart.student.dto;

import com.smart.student.entity.Department;

public class DepartmentDto {
    private Long id;
    private String departmentName;
    private String departmentCode;
    private String description;

    public DepartmentDto() {}

    public DepartmentDto(Long id, String departmentName, String departmentCode, String description) {
        this.id = id;
        this.departmentName = departmentName;
        this.departmentCode = departmentCode;
        this.description = description;
    }

    public static DepartmentDto fromEntity(Department d) {
        if (d == null) return null;
        return new DepartmentDto(d.getId(), d.getDepartmentName(), d.getDepartmentCode(), d.getDescription());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
