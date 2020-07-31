package com.tumile.salesman.api;

import com.tumile.salesman.service.CityService;
import com.tumile.salesman.service.dto.response.CityRes;
import com.tumile.salesman.service.dto.response.CityNameRes;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityResource {

    private final CityService cityService;

    public CityResource(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/search")
    public List<CityNameRes> search(@RequestParam String query) {
        return cityService.search(query);
    }

    @GetMapping("/{cityId}")
    public CityRes get(@PathVariable Long cityId) {
        return cityService.get(cityId);
    }
}
