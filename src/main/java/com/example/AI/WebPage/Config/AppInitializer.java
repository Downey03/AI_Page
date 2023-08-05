package com.example.AI.WebPage.Config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class AppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[0];
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        Class[] classList = {};
        return classList;
    }

    @Override
    protected String[] getServletMappings() {
        String[] classList = {};
        return classList;
    }
}
