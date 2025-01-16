$(document).ready(function() {
    let chart;
    
    $('#calculatorForm').submit(function(e) {
        e.preventDefault();
        let equations = $('#equations').val().split(','); // Split equations by comma
        let minX = parseFloat($('#minX').val());
        let maxX = parseFloat($('#maxX').val());
        let selectedGraphType = $('#graphType').val(); // Read the selected graph type from the dropdown

        if (isNaN(minX) || isNaN(maxX) || minX >= maxX) {
            alert('Invalid range. Please check your input.');
            return;
        }

        let canvas = document.getElementById('graph').getContext('2d');
        let xValues = [];
        let datasets = [];

        for (let equation of equations) {
            equation = equation.trim(); // Remove leading/trailing spaces
            let yValues = [];

            try {
                for (let x = minX; x <= maxX; x += 0.1) {
                    xValues.push(x);
                    // Replace "^" with "**" and append "Math." to mathematical expressions in the equation
                    let equationForEval = equation;
                    equationForEval = equationForEval.replace(/(sin|cos|tan|sqrt|log|exp|pi|e)(?=\()|pi|e/g, 'Math.$&');
                    equationForEval = equationForEval.replace(/\^/g, '**');
                    let result = eval(equationForEval);


                    // Check if the result is a valid number, not NaN
                    if (!isNaN(result)) {
                        yValues.push(result);
                    } else {
                        // Handle the case where the equation is invalid
                        throw new Error('Invalid Equation');
                    }
                }

                datasets.push({
                    label: equation,
                    data: yValues,
                    borderColor: getRandomColor(),
                    borderWidth: 2,
                });
            } catch (error) {
                // Handle the error and provide feedback to the user
                console.error(error);
                alert(`Invalid equation: "${equation}". Please check your input.`);
                return;
            }
        }

        if (chart) chart.destroy();

        chart = new Chart(canvas, {
            type: selectedGraphType,
            data: {
                labels: xValues,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'X'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Y'
                        }
                    }
                }
            }
        });

        $('.graphic-container').addClass('active');
    });

    $('#resetBtn').on('click', () => {
        if (chart) chart.destroy();
        $('.graphic-container').removeClass('active');
    });
});

function getRandomColor() {
    // Generates a random hexadecimal color
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

const sun = "images/sun.png";
const moon = "images/moon.png";




document.body.style="background-color: var(--bs-dark);transition: 0.5s;"
const sunImage = new Image();
sunImage.src = sun;

const moonImage = new Image();
moonImage.src = moon;



var theme = "dark";
  const root = document.querySelector(":root");
  const container = document.getElementsByClassName("theme-container")[0];
  const themeIcon = document.getElementById("theme-icon");
  container.addEventListener("click", setTheme);
  function setTheme() {
    switch (theme) {
      case "dark":
        setLight();
        theme = "light";
        break;
      case "light":
        setDark();
        theme = "dark";
        break;
    }
  }
  function setLight() {
    root.style.setProperty(
      "--bs-dark",
      "linear-gradient(318.32deg, #c3d1e4 0%, #dde7f3 55%, #d4e0ed 100%)"
    );
    container.classList.remove("shadow-dark");
    setTimeout(() => {
      container.classList.add("shadow-light");
      themeIcon.classList.remove("change");
    }, 300);
    themeIcon.classList.add("change");
    themeIcon.src = sun;
  }
  function setDark() {
    root.style.setProperty("--bs-dark", "#000");
    container.classList.remove("shadow-light");
    setTimeout(() => {
      container.classList.add("shadow-dark");
      themeIcon.classList.remove("change");
    }, 300);
    themeIcon.classList.add("change");
    themeIcon.src = moon;
  }

//Project Elipse

  function generateEllipsoidProjection(a, b, c, plane) {
    const points = [];
    const step = 0.1; // Adjust resolution

    for (let t = -Math.PI; t <= Math.PI; t += step) {
        let x, y, z;
        switch (plane) {
            case 'xy': // XY Plane (z = 0)
                x = a * Math.cos(t);
                y = b * Math.sin(t);
                points.push({ x, y });
                break;

            case 'xz': // XZ Plane (y = 0)
                x = a * Math.cos(t);
                z = c * Math.sin(t);
                points.push({ x, y: z });
                break;

            case 'yz': // YZ Plane (x = 0)
                y = b * Math.cos(t);
                z = c * Math.sin(t);
                points.push({ x: y, y: z });
                break;
        }
    }
    return points;
}


function plotEllipsoidProjection(a, b, c, plane) {
    const points = generateEllipsoidProjection(a, b, c, plane);

    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);

    if (chart) chart.destroy();

    const canvas = document.getElementById('graph').getContext('2d');
    chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: `Ellipsoid (${plane.toUpperCase()} Projection)`,
                data: yValues,
                borderColor: getRandomColor(),
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'X'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Y'
                    }
                }
            }
        }
    });
}


$('#calculatorForm').submit(function (e) {
    e.preventDefault();
    const selectedGraphType = $('#graphType').val();

    if (selectedGraphType === 'ellipsoid') {
        const a = parseFloat($('#a').val());
        const b = parseFloat($('#b').val());
        const c = parseFloat($('#c').val());
        const projection = $('#projection').val();

        if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
            alert('Invalid ellipsoid parameters. Please check your input.');
            return;
        }

        plotEllipsoidProjection(a, b, c, projection);
    }
});

function parseEllipsoidEquation(equation) {
    // Match terms like x^2/a and y^2/b
    const match = equation.match(/x\^2\/([\d.]+)\s*\+\s*y\^2\/([\d.]+)\s*=\s*1/);

    if (!match) {
        throw new Error('Invalid equation format. Use the form: x^2/a + y^2/b = 1');
    }

    const a = parseFloat(match[1]);
    const b = parseFloat(match[2]);

    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        throw new Error('Invalid values for a or b. Ensure they are positive numbers.');
    }

    return { a, b };
}


function generateEllipsoidProjection(a, b) {
    const points = [];
    const step = 0.1; // Adjust resolution

    for (let t = -Math.PI; t <= Math.PI; t += step) {
        const x = Math.sqrt(a) * Math.cos(t);
        const y = Math.sqrt(b) * Math.sin(t);
        points.push({ x, y });
    }

    return points;
}


$('#calculatorForm').submit(function (e) {
    e.preventDefault();
    const selectedGraphType = $('#graphType').val();

    if (selectedGraphType === 'ellipsoid') {
        try {
            const equation = $('#ellipsoid-equation').val();
            const { a, b } = parseEllipsoidEquation(equation);
            const points = generateEllipsoidProjection(a, b);

            const xValues = points.map(p => p.x);
            const yValues = points.map(p => p.y);

            if (chart) chart.destroy();

            const canvas = document.getElementById('graph').getContext('2d');
            chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: [{
                        label: `Ellipsoid: ${equation}`,
                        data: yValues,
                        borderColor: getRandomColor(),
                        borderWidth: 2,
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'X'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Y'
                            }
                        }
                    }
                }
            });

        } catch (error) {
            alert(error.message);
        }
    }
});

$(document).ready(function() {
    let chart;

    $('#calculatorForm').submit(function(e) {
        e.preventDefault();
        const equations = $('#equations').val().split(',');
        const minX = parseFloat($('#minX').val());
        const maxX = parseFloat($('#maxX').val());
        const selectedGraphType = $('#graphType').val();

        if (isNaN(minX) || isNaN(maxX) || minX >= maxX) {
            alert('Invalid range. Please check your input.');
            return;
        }

        if (selectedGraphType === 'ellipsoid') {
            handleEllipsoidGraph();
        } else {
            handleGraph(equations, minX, maxX, selectedGraphType);
        }
    });

    $('#resetBtn').on('click', () => resetGraph());

    function handleGraph(equations, minX, maxX, graphType) {
        const xValues = [];
        const datasets = [];

        for (let equation of equations) {
            equation = equation.trim();
            const yValues = calculateYValues(equation, minX, maxX);
            if (yValues) {
                datasets.push({
                    label: equation,
                    data: yValues,
                    borderColor: getRandomColor(),
                    borderWidth: 2,
                });
            }
        }

        renderGraph(xValues, datasets, graphType);
    }

    function calculateYValues(equation, minX, maxX) {
        const yValues = [];
        try {
            for (let x = minX; x <= maxX; x += 0.1) {
                let equationForEval = equation.replace(/(sin|cos|tan|sqrt|log|exp|pi|e)/g, 'Math.$&').replace(/\^/g, '**');
                const result = eval(equationForEval);
                if (!isNaN(result)) {
                    yValues.push(result);
                }
            }
        } catch (error) {
            alert(`Invalid equation: "${equation}". Please check your input.`);
            return null;
        }
        return yValues;
    }

    function renderGraph(xValues, datasets, graphType) {
        if (chart) chart.destroy();
        const canvas = document.getElementById('graph').getContext('2d');
        chart = new Chart(canvas, {
            type: graphType,
            data: { labels: xValues, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'X' } },
                    y: { title: { display: true, text: 'Y' } }
                }
            }
        });
        $('.graphic-container').addClass('active');
    }

    function resetGraph() {
        if (chart) chart.destroy();
        $('.graphic-container').removeClass('active');
    }

    function handleEllipsoidGraph() {
        const equation = $('#ellipsoid-equation').val();
        try {
            const { a, b } = parseEllipsoidEquation(equation);
            const points = generateEllipsoidProjection(a, b);
            const xValues = points.map(p => p.x);
            const yValues = points.map(p => p.y);
            renderGraph(xValues, [{ label: `Ellipsoid: ${equation}`, data: yValues, borderColor: getRandomColor(), borderWidth: 2, fill: false }], 'line');
        } catch (error) {
            alert(error.message);
        }
    }

    function parseEllipsoidEquation(equation) {
        const match = equation.match(/x\^2\/([\d.]+)\s*\+\s*y\^2\/([\d.]+)\s*=\s*1/);
        if (!match) throw new Error('Invalid equation format. Use the form: x^2/a + y^2/b = 1');
        const a = parseFloat(match[1]);
        const b = parseFloat(match[2]);
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) throw new Error('Invalid values for a or b.');
        return { a, b };
    }

    function generateEllipsoidProjection(a, b) {
        const points = [];
        const step = 0.1;
        for (let t = -Math.PI; t <= Math.PI; t += step) {
            points.push({ x: a * Math.cos(t), y: b * Math.sin(t) });
        }
        return points;
    }

    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
});
