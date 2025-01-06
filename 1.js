const data = [
    {
        "Free": ["Learn HTML", "Learn CSS", "Web desin"]
    },
    {
        "New to Coding": ["HTML", "CSS", "Responsive"]
    },
    {
        "Most Popular": ["Java", "Python", "SCSS"]
    },
    {
        "Skills Paths": ["Flask", "Django", "Fast API"]
    },
    {
        "Career Paths": ["Next", "Nest", "Sanity"]
    },
];
for(let obj of data)
{
    for(let x in obj)
        console.log(x,obj[x])
}
// console.log(data["Free"])
