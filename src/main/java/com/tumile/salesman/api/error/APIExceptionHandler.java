package com.tumile.salesman.api.error;

import lombok.Data;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;

@RestControllerAdvice
public class APIExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers, HttpStatus status,
                                                                  WebRequest request) {
        FieldError fieldError = ex.getBindingResult().getFieldErrors().get(0);
        Error error = new Error(HttpStatus.BAD_REQUEST, fieldError.getDefaultMessage(), new Date());
        return handleExceptionInternal(ex, error, new HttpHeaders(), error.getStatus(), request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> methodArgumentTypeMismatchExceptionHandler(MethodArgumentTypeMismatchException ex) {
        Error error = new Error(HttpStatus.NOT_FOUND, "Resource not found", new Date());
        return ResponseEntity.status(error.getStatus()).body(error);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> notFoundExceptionHandler(NotFoundException ex) {
        Error error = new Error(HttpStatus.NOT_FOUND, ex.getMessage(), new Date());
        return ResponseEntity.status(error.getStatus()).body(error);
    }

    @ExceptionHandler({AuthenticationException.class, IllegalArgumentException.class})
    public ResponseEntity<Object> badRequestExceptionHandler(RuntimeException ex) {
        Error error = new Error(HttpStatus.BAD_REQUEST, ex.getMessage(), new Date());
        return ResponseEntity.status(error.getStatus()).body(error);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Object> illegalStateExceptionHandler(IllegalStateException ex) {
        Error error = new Error(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), new Date());
        return ResponseEntity.status(error.getStatus()).body(error);
    }

    @Data
    private static class Error {
        private final HttpStatus status;
        private final String message;
        private final Date timestamp;
    }
}
