import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      alert('Enrolled!');
    } catch (err) {
      alert(err.response?.data?.message || 'Enroll failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '30px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>All Courses</h2>
        {user ? (
          <button onClick={logout}>Logout ({user.name})</button>
        ) : (
          <div>
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>

      {courses.map((course) => (
        <div key={course._id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 10 }}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p><i>Instructor: {course.instructor?.name}</i></p>
          {user?.role === 'student' && (
            <button onClick={() => handleEnroll(course._id)}>Enroll</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default CourseList;