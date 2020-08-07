package com.tumile.salesman.repository;

import com.tumile.salesman.domain.Course;
import org.springframework.data.repository.CrudRepository;

public interface CourseRepository extends CrudRepository<Course, Course.CourseId> {
}
