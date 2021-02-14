const hexValueSanitize = (color) => color
    .replace(/\s/g, '')
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`)
    .replace('#', '');

const getRed = (hex) => parseInt(hex.substring(0, 2), 16);
const getGreen = (hex) => parseInt(hex.substring(2, 4), 16);
const getBlue = (hex) => parseInt(hex.substring(4, 6), 16);

const hexColorDelta = (hexA, hexB) => {
    // calculate differences between reds, greens, blues and limit differences between 0 and 1
    let r = (255 - Math.abs(getRed(hexA) - getRed(hexB))) / 255;
    let g = (255 - Math.abs(getGreen(hexA) - getGreen(hexB))) / 255;
    let b = (255 - Math.abs(getBlue(hexA) - getBlue(hexB))) / 255;

    // 0 means opposit colors, 1 means same colors
    return (r + g + b) / 3;
}

const constructColor = (colorHex) => {
    const sanitizedHex = hexValueSanitize(colorHex);

    let colorObj = {
        hex: sanitizedHex,
        rgb: {
            red: getRed(sanitizedHex),
            green: getGreen(sanitizedHex),
            blue: getBlue(sanitizedHex),
        }  
    };

    const r = colorObj.rgb.red / 255;
    const g = colorObj.rgb.green / 255;
    const b = colorObj.rgb.blue / 255;

    /* Getting the Max and Min values for Chroma. */
    const max = Math.max.apply(Math, [r, g, b]);
    const min = Math.min.apply(Math, [r, g, b]);

    /* Variables for HSV value of hex color. */
    const chr = max - min;
    const val = max;
    let hue = 0;
    let sat = 0;

    if (val > 0) {
        /* Calculate Saturation only if Value isn't 0. */
        sat = chr / val;

        if (sat > 0) {
            if (r === max) {
                hue = 60 * (((g - min) - (b - min)) / chr);
                if (hue < 0) {
                    hue += 360;
                }
            } else if (g === max) {
                hue = 120 + 60 * (((b - min) - (r - min)) / chr);
            } else if (b === max) {
                hue = 240 + 60 * (((r - min) - (g - min)) / chr);
            }
        }
    }

    colorObj.chroma = chr;
    colorObj.hue = hue;
    colorObj.sat = sat;
    colorObj.val = val;
    colorObj.luma = .299 * r + .587 * g + .114 * b;
    colorObj.yiq = ((colorObj.rgb.red * 299) + (colorObj.rgb.green * 587) + (colorObj.rgb.blue * 114)) / 1000;

    return colorObj;
};

const sortByLuma = (patchedColors) => patchedColors.sort((a, b) => a.luma - b.luma);
const sortByHue = (patchedColors) => patchedColors.sort((a, b) => a.hue - b.hue);
const sortBySat = (patchedColors) => patchedColors.sort((a, b) => a.sat - b.sat);
const sortByVal = (patchedColors) => patchedColors.sort((a, b) => a.val - b.val);

const sortByDistance = (patchedColors) => {
    let data = {
        white: { baseColor: '#FFFFFF', closestColors: [], },
        silver: { baseColor: '#C0C0C0', closestColors: [], },
        gray: { baseColor: '#808080', closestColors: [], },
        black: { baseColor: '#000000', closestColors: [], },
        red: { baseColor: '#FF0000', closestColors: [], },
        maroon: { baseColor: '#800000', closestColors: [], },
        yellow: { baseColor: '#FFFF00', closestColors: [], },
        olive: { baseColor: '#808000', closestColors: [], },
        lime: { baseColor: '#00FF00', closestColors: [], },
        green: { baseColor: '#008000', closestColors: [], },
        aqua: { baseColor: '#00FFFF', closestColors: [], },
        teal: { baseColor: '#008080', closestColors: [], },
        blue: { baseColor: '#0000FF', closestColors: [], },
        navy: { baseColor: '#000080', closestColors: [], },
        fuchsia: { baseColor: '#FF00FF', closestColors: [], },
        purple: { baseColor: '#800080', closestColors: [], },
    };
    let sortedArr = [];

    patchedColors.forEach((patchedColor) => {
        let closest = {
            colorName: null,
            colorDistance: null,
        };

        for (let color in data) {
            const baseColorHex = hexValueSanitize(data[color].baseColor);
            const distance = hexColorDelta(patchedColor.hex, baseColorHex);

            if (distance > closest.colorDistance) {
                closest.colorName = color;
                closest.colorDistance = distance;
            }
        }

        patchedColor.distance = closest.colorDistance;

        data[closest.colorName].closestColors.push(patchedColor);
    });

    for (let color in data) {
        sortedArr = [
            ...sortedArr,
            ...data[color].closestColors.sort((a, b) => a.distance - b.distance)
        ];
    };

    return sortedArr;
};

const getList = (patchedColors) => patchedColors.map(
    (color) => `
        <div
            class="colors-list__item"
            style="
                background-color: #${color.hex};
                flex-basis: ${document.getElementById('item-width').value || 150}px;
                height: ${document.getElementById('item-height').value || 150}px;
            "
        >
            <span
                class="colors-list__item-text"
                style="color: #${color.yiq >= 128 ? '000000' : 'ffffff'};"
            >
                #${color.hex}
            </span>
        </div>
    `
)
.join('');

const renderResult = (hexArray) => {
    const patchedColorsArray = hexArray.map(constructColor);

    let result = [
        {
            title: 'Your unsorted list',
            data: [...patchedColorsArray]
        },
        {
            title: 'Sort by Distance',
            data: sortByDistance([...patchedColorsArray])
        },
        {
            title: 'Sort by Hue (Hsv)',
            data: sortByHue([...patchedColorsArray])
        },
        {
            title: 'Sort by Saturation (hSv)',
            data: sortBySat([...patchedColorsArray])
        },
        {
            title: 'Sort by Value (hsV)',
            data: sortByVal([...patchedColorsArray])
        },
        {
            title: 'Sort by Luma',
            data: sortByLuma([...patchedColorsArray])
        },
    ]
    .map((list, index) => `
        ${index !== 0 ? '<hr class="mb-4" />' : ''}
        <h2>${list.title}</h2>
        <div class="colors-list">${getList(list.data)}</div>
    `)
    .join('');

    document.getElementById('results').innerHTML = result;
};

const renderData = () => {
    const { value } = document.getElementById('colors-list');

    if (value) {
        renderResult(value.split(',').filter((hex) => hex !== ''));
    }
}

document.getElementById('btn-submit').addEventListener('click', renderData);

renderData();
