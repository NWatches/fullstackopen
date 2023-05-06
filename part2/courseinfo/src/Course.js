const Header = (props) => {
    return (
        <h2>{props.name}</h2>
    )
  }
  
  const Content = (props) => {
    return (
        <div>
          {props.parts.map(part => 
            <Part key={part.id} part={part} />)}
        </div>
    )
  }
  
  const Part = (props) => {
    return (
        <p>
          {props.part.name} {props.part.exercises}
        </p>
    )
    
  }
  
  const Total = (props) => {
    const total = props.parts.reduce((sum, parts) => sum + parts.exercises, 0)
  
    return (
        <b>Number of exercises {total}</b>
    )
  }
  
  
  const Course = ({ courses }) => {
    return (
      <div>
        <h1>Web development curriculum</h1>
        {courses.map(course =>
          <div>
            <Header key={course.id} name={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts} />
          </div>
        )}
      </div>
    )  
  }

export default Course