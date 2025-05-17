
function populateDropdown(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">-- Select --</option>';
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

function showPaths() {
    const currentQual = document.getElementById('currentQualification').value;
    const endGoal = document.getElementById('endGoal').value;
    const pathsDiv = document.getElementById('paths');
    pathsDiv.innerHTML = '';

    if (currentQual) {
        const paths = careerPaths[currentQual] || [];
        const heading = document.createElement('h3');
        heading.textContent = `Paths from "${currentQual}":`;
        pathsDiv.appendChild(heading);
        paths.forEach(path => {
            const div = document.createElement('div');
            div.textContent = path;
            pathsDiv.appendChild(div);
        });
    }

    if (endGoal) {
        const goalSteps = goalPaths[endGoal] || [];
        const heading = document.createElement('h3');
        heading.textContent = `Steps to reach "${endGoal}":`;
        pathsDiv.appendChild(heading);
        goalSteps.forEach(step => {
            const div = document.createElement('div');
            div.textContent = step;
            pathsDiv.appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateDropdown('currentQualification', qualifications);
    populateDropdown('endGoal', careerGoals);

    document.getElementById('currentQualification').addEventListener('change', showPaths);
    document.getElementById('endGoal').addEventListener('change', showPaths);
});
