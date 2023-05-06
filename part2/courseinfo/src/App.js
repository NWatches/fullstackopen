import Course from './Course'

/*const Header = (props) => {
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
*/

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return <Course courses={courses}/>
}

export default App