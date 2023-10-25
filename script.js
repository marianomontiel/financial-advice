//Chart range slider
(function () {
    const
        range = document.getElementById('range'),
        tooltip = document.getElementById('tooltip'),
        setValue = () => {
            const
                newValue = Number((range.value - range.min) * 100 / (range.max - range.min)),
                newPosition = 16 - (newValue * 0.32);
            tooltip.innerHTML = `<span>${range.value}</span>`;
            tooltip.style.left = `calc(${newValue}% + (${newPosition}px))`;
            document.documentElement.style.setProperty("--range-progress", `calc(${newValue}% + (${newPosition}px))`);
        };
    document.addEventListener("DOMContentLoaded", setValue);
    range.addEventListener('input', setValue);
})();

(function () {
    //chart
    let initial_deposit = document.querySelector('#range'),
        contribution_amount = document.querySelector('#contribution_amount'),
        investment_timespan = document.querySelector('#investment_timespan'),
        investment_timespan_text = document.querySelector('#investment_timespan_text'),
        estimated_return = document.querySelector('#estimated_return'),
        future_balance = document.querySelector('#future_balance'),
        future_savings = document.querySelector('#future_savings');

    function updateValue(element, action) {
        var min = parseFloat(element.getAttribute('min')),
            max = parseFloat(element.getAttribute('max')),
            step = parseFloat(element.getAttribute('step')) || 1,
            oldValue = element.dataset.value || element.defaultValue || 0,
            newValue = parseFloat(element.value.replace(/\$/, ''));

        if (isNaN(parseFloat(newValue))) {
            newValue = oldValue;
        } else {
            if (action == 'add') {
                newValue += step;
            } else if (action == 'sub') {
                newValue -= step;
            }

            newValue = newValue < min ? min : newValue > max ? max : newValue;
        }

        element.dataset.value = newValue;
        element.value = (element.dataset.prepend || '') + newValue + (element.dataset.append || '');

        updateChart();
    }

    function getChartData() {
        //creat compound values array
        let P = parseFloat(initial_deposit.value), // Principal
            r = 0.07, // Annual Interest Rate
            c = P, // Contribution Amount
            n = 12, // Compound Period
            n2 = 12, // Contribution Period i.e Does the contribution amount done on a monthly or anual basis?
            t = 30, // Investment Time Span
            currentYear = (new Date()).getFullYear()
            ;

        // Chart.defaults.font.size = 20
        //populate only the first and last value in the label array
        let labels = [];
        labels.length = t;
        labels[0] = "Hoy";
        for (let i = 1, year = labels.length - 1; i <  year; i++) {
            labels [i] = []
            labels[i].push("");
        }
        labels[29] = currentYear + t;


        let principal_dataset = {
            label: `Ahorro`,
            fill: true,
            backgroundColor: (context) => {
                //gradient colors
                const gradient = [
                    'rgba(102,102,102,0.5)',
                    'rgba(255,255,255,1)'
                ];

                if (!context.chart.chartArea) {
                    return;
                }
                const { ctx, data, chartArea: { top, bottom } } = context.chart;
                const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                const colorLayers = 1 / (gradient.length - 1);

                for (let i = 0; i < gradient.length; i++) {
                    gradientBg.addColorStop(0 + i * colorLayers, gradient[i])
                }

                return gradientBg;
            },
            borderColor: 'rgba(102, 102, 102, 1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 30,
            tension: 0,
            data: []
        };

        let interest_dataset = {
            label: `Inversion Año: ${"hi"}"`,
            fill: true,
            backgroundColor: (context) => {
                //gradient colors
                const gradient = [
                    'rgba(54,135,39,0.5)',
                    'rgba(255,255,255,1)'
                ];

                if (!context.chart.chartArea) {
                    return;
                }
                const { ctx, data, chartArea: { top, bottom } } = context.chart;
                const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                const colorLayers = 1 / (gradient.length - 1);

                for (let i = 0; i < gradient.length; i++) {
                    gradientBg.addColorStop(0 + i * colorLayers, gradient[i])
                }

                return gradientBg;
            },
            borderColor: 'rgba(54,135,39,1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 200,

            tension: 0,
            data: []
        };


        for (let i = 0; i < t; i++) {
            let principal = P + (c * n2 * i),
                interest = 0,
                balance = principal;

            if (r) {
                let x = Math.pow(1 + r / n, n * i),
                    compound_interest = P * x,
                    contribution_interest = c * (x - 1) / (r / n2);
                interest = (compound_interest + contribution_interest /* - principal */).toFixed(0)
                balance = (compound_interest + contribution_interest).toFixed(0);
            }

            future_balance.innerHTML = '$' + parseFloat(balance).toLocaleString("en-US");
            future_savings.innerHTML = '$' + principal.toLocaleString("en-US");
            principal_dataset.data.push(principal);
            interest_dataset.data.push(interest);
        }

        return {
            labels: labels,
            datasets: [principal_dataset, interest_dataset]
        }
    }

    function updateChart() {
        var data = getChartData();

        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.datasets[0].data;
        chart.data.datasets[1].data = data.datasets[1].data;
        chart.update();
    }

    initial_deposit.addEventListener('change', function () {
        updateValue(this);
        updateChart();
    });


    var ctx = document.getElementById('myChart').getContext('2d'),
        chart = new Chart(ctx, {
            type: 'line',
            data: getChartData(),
            options: {
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            font: {
                                size: 66
                            }
                        }
                    }
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ': $' + tooltipItem.yLabel;
                        }
                    }
                },
                responsive: true,
                scales: {
                    x: {
                        grid: {
                            display :false,
                        },
                        stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Year'
                        },
                        ticks: {
                            fontSize: 60
                        }
                    },
                    y: {
                        stacked: false,
                        display: false,
                        min: 0,
                        max: 1228087,
                        ticks: {
                            beginAtZero: true,
                            stepSize: 2456.17
                        }
                    }
                },
                /* onHover: (e, activeElements, chart) => {
                    const datasets = chart.config.data.datasets;
                    if (activeElements[0]) {
                      let ctx = activeElements[0].element.$context;
                      datasets[ctx.datasetIndex ? 0 : 1].backgroundColor = 'rgb(0,0,0)';
                      datasets[ctx.datasetIndex ? 1 : 0].backgroundColor = 'rgb(25,25,25)';
                    } else {
                      datasets.forEach(ds => ds.backgroundColor = bgColor);
                    }
                    chart.update();
                  } */
            }
        });
})()