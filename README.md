The goal is to take a SVG, exported from Toonboom Harmony (as PDF) and converted with inkscape, and process the vector file to be suitable for the MSDF generator. The MSDF tools requires that its input SVG file has a single path.

At minimum this tool should:
Flatten and ungroup all elements for the input vector graphic.
Convert remaining paths into a single compound path (we don't care about losing color information as the MSDF only cares about edges)
Simplify the resultant path as to prevent MSDF artifacts.

Extensions include:
Compare alpha of rasterised input vs MSDF test output, finding similarity of two images.
If similarity is below a threadhold, try either:
    - Generating the output from a higher resolution MSDF
    - Further smoothing and/or simplifying vector paths to reduce artifacts.
Similarities should be stored, and the most similar configuration should be used.

Seperate vector into parts via color. Each of these parts can generate its own SDF, mapping each distinct color to a color channel (RGB, then rolling to a new file). When rendering the output, we can render each part on top of each other, reconstructing the image while preserving sharp transitions. 

We need to consider how to store the color information for each of these channels (the original colour). This could be done in the texture atlas, but added extra fields may break stuff.

For colour art we can use a SDF instead of a MSDF because we do not care about preserving sharp corners.
Line art will only be 1 colour and corners must be preserved so we will use MSDF.

PDF to SVG conversion will be useful as it will remove the need to use inkscape for conversion.