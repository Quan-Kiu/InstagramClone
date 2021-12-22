const removeList = (index) => {
    localStorage.removeItem('jobs');
    var newArray = [...jobs];
    newArray.splice(index, 1);
    localStorage.setItem('job', JSON.stringify(newArray));
    setJob(newArray);
};

jobs.map((job, index) => (
    <li key={index}>
        <button onClick={() => removeList(index)}></button>
    </li>
));
