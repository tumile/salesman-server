package com.tumile.salesman.service.dto.response;

import com.tumile.salesman.domain.PointOfInterest;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class POIRes {

    private Long id;

    private String name;

    private String image;

    private Double latitude;

    private Double longitude;

    private String description;

    public static POIRes fromPOI(PointOfInterest poi) {
        POIRes res = new POIRes();
        res.setId(poi.getId());
        res.setName(poi.getName());
        res.setImage(poi.getImage());
        res.setLatitude(poi.getLatitude());
        res.setLongitude(poi.getLongitude());
        res.setDescription(poi.getDescription());
        return res;
    }
}
