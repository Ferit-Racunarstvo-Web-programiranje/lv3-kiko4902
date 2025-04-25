document.addEventListener("DOMContentLoaded", () => {
    const jsonPath = "data/temperature.json";  
  
    fetch(jsonPath)
      .then(res => res.json())  
      .then(data => {
        const applyFiltersButton = document.getElementById("apply-filters");
        const slider = document.getElementById("filter-value");
        const valueDisplay = document.getElementById("value-display");
    
        valueDisplay.textContent = slider.value;
        
        slider.addEventListener("input", () => {
          valueDisplay.textContent = slider.value;
        });
    
        let tripPlan = [];  
  
        function addToTripPlan(day) {
          if (!tripPlan.some(item => item.ID === day.ID)) {
            tripPlan.push(day);
            refreshTripPlan();
          } else {
            alert("This day is already in your trip plan!");
          }
        }
  
        function refreshTripPlan() {
          const tripList = document.getElementById('trip-list');
          tripList.innerHTML = '';  
          tripPlan.forEach((day, index) => {
            const li = document.createElement('li');
            li.textContent = `${day.Season} - ${day.Location} (${day["Weather Type"]}, Temp: ${day.Temperature}°C)`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeFromTripPlan(index);
            li.appendChild(removeBtn);
            tripList.appendChild(li);
          });
        }
  
        function removeFromTripPlan(index) {
          tripPlan.splice(index, 1);
          refreshTripPlan();
        }
  
        function createStyledTable(data) {
          const table = document.getElementById("temperature-table");
    
          if (!table) {
            console.error('Table element not found!');
            return;
          }
    
          let tbody = table.querySelector("tbody");
    
          if (!tbody) {
            tbody = document.createElement("tbody");
            table.appendChild(tbody);
          }
    
          tbody.innerHTML = ''; 
    
          if (data.length > 0) {
            const headers = Object.keys(data[0]);
    
            const headerRow = table.querySelector("thead tr");
            if (headerRow.children.length === 0) {
              headers.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                headerRow.appendChild(th);
              });
            }
    
            data.forEach(row => {
              const tr = document.createElement("tr");
              headers.forEach(header => {
                const td = document.createElement("td");
                td.textContent = row[header];
                tr.appendChild(td);
              });
    
              const addButtonCell = document.createElement("td");
              const addButton = document.createElement("button");
              addButton.textContent = "Add to Trip";
              addButton.onclick = () => addToTripPlan(row); 
              addButtonCell.appendChild(addButton);
              tr.appendChild(addButtonCell);
    
              tbody.appendChild(tr);
            });
          }
        }
  
        function filterData() {
          const seasonFilter = document.getElementById("filter-season").value;
          const locationFilter = document.getElementById("filter-location").value;
          const minTemp = parseFloat(document.getElementById("filter-temp-min").value) || -Infinity;
          const maxTemp = parseFloat(document.getElementById("filter-temp-max").value) || Infinity;
          const weatherTypeFilter = document.getElementById("filter-weather-type").value;
          
          const selectedSliderValue = parseInt(slider.value);
    
          const filteredData = data.filter(item => {
            const isSeasonMatch = seasonFilter ? item.Season === seasonFilter : true;
            const isLocationMatch = locationFilter ? item.Location === locationFilter : true;
            const isWeatherMatch = weatherTypeFilter ? item["Weather Type"] === weatherTypeFilter : true;
            const isTempMatch = item.Temperature >= minTemp && item.Temperature <= maxTemp;
            
            const isUVIndexMatch = item["UV Index"] >= selectedSliderValue;
    
            return isSeasonMatch && isLocationMatch && isWeatherMatch && isTempMatch && isUVIndexMatch;
          });
    
          displayTable(filteredData.slice(0, 20));  
        }
  
        function displayTable(filteredData) {
          createStyledTable(filteredData);
        }
  
        applyFiltersButton.addEventListener("click", filterData);
    
        displayTable(data.slice(0, 20));
  
        document.getElementById('confirm-trip').addEventListener('click', () => {
          if (tripPlan.length === 0) {
            alert("Your trip plan is empty!");
          } else {
            alert(`You have successfully planned your trip with ${tripPlan.length} days!`);
            tripPlan = []; 
            refreshTripPlan();
          }
        });
  
      })
      .catch(error => console.error("Error fetching JSON:", error));
  });
  