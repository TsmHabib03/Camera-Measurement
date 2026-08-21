# Calibration guide

PlaneMeasure converts camera coordinates into physical coordinates using the supplied square fiducial. The outside edge of the black square is exactly **50.00 mm by 50.00 mm** when printed correctly.

## Print the marker

1. Press **Download print-ready PDF** in the application's Calibration panel.
2. Send the A4 PDF to the print shop and ask them to print it without resizing.
3. Disable options such as Fit to page, Shrink oversized pages, or Scale to printable area.
4. Use a physical ruler or caliper to verify that the outside black square measures **50.00 mm on both sides**.
5. If it does not measure 50.00 mm, correct the printer settings before using it.

The PDF centers the marker on an A4 page and includes a 100 mm verification line. Keep enough white paper outside the black border so the boundary remains easy to detect.

## Place the marker

- Put the marker and the object on the **same flat, rigid surface**.
- Keep all four marker corners visible.
- Do not bend, curl, laminate with a reflective finish, or partially cover the marker.
- Avoid strong glare and deep shadows.
- Move the camera close enough that the marker occupies a useful portion of the image while the complete object still fits.
- Focus the camera before drawing a measurement.

## Calibrate

1. Run the project through localhost or HTTPS.
2. Start the camera and grant permission.
3. Aim at the marker until the interface reports:
   - Marker detected: Yes
   - Scale calibrated: a pixels-per-millimetre value
   - Perspective correction: Active
4. If quality is low, move closer, improve lighting, reduce glare, or make the camera angle less extreme.
5. Select Free, Length, Width, or Height and drag between two points on the calibrated plane.

The application continually recalibrates while the marker remains visible. Keep the marker in frame while measuring so camera movement does not invalidate the most recent transform.

## Why perspective correction works

The four known marker corners define a projective mapping, or homography, from camera pixels to a 50 mm square coordinate system. Every measurement endpoint is projected through that transform before its Euclidean distance is calculated. This corrects perspective for points lying on the same physical plane as the marker.

## Accuracy limitations

This first version does not estimate depth. It cannot accurately measure:

- a point above or below the calibrated surface;
- the vertical height of a three-dimensional object;
- a surface that is curved or on a different plane;
- a marker that is printed at the wrong size;
- an image with severe uncorrected lens distortion.

Accuracy also depends on camera resolution, focus, motion blur, lighting, marker pixel size, print quality, camera angle, and endpoint placement. A decimal display is not an accuracy guarantee.

## Lens distortion

PlaneMeasure does not apply generic distortion correction because that would be physically misleading. True correction needs the specific camera's intrinsic matrix and distortion coefficients, normally obtained from a multi-image checkerboard calibration. Adding a guided intrinsic-calibration workflow is a future enhancement.

## Recalibrate

Reposition the marker and wait for the calibration status to become valid again whenever:

- the camera moves;
- zoom or camera selection changes;
- the marker or object moves to another surface;
- focus or resolution changes;
- the marker disappears for more than a moment.

## Test real error

Use a rigid known reference such as a 100.00 mm section of a quality ruler or a gauge block.

1. Calibrate normally.
2. Draw a measurement across the known span.
3. Enter the expected length in the Accuracy test panel.
4. Add the current reading.
5. Review absolute error and percentage error.

Repeat this at several positions and orientations on the plane. Error that grows far from the marker often indicates lens distortion, poor marker corner localization, or an object that is not truly coplanar.
