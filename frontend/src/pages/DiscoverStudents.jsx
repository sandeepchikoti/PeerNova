import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { StudentCard } from '../components/StudentCard';
import { Search, Compass, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';

export const DiscoverStudents = () => {
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [connectMessage, setConnectMessage] = useState('');

  const fetchDiscoveryData = async () => {
    setLoading(true);
    try {
      const [studentsData, categoriesData] = await Promise.all([
        api.discoverStudents({
          search,
          category: selectedCategory === 'ALL' ? '' : selectedCategory,
          college: collegeFilter === 'ALL' ? '' : collegeFilter,
        }),
        api.getSkillCategories(),
      ]);
      setStudents(studentsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load discovery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryData();
  }, [selectedCategory, collegeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDiscoveryData();
  };

  const handleConnect = (student) => {
    setConnectMessage(`Connection request interest registered for ${student.fullName}! (Phase 3 Connections feature ready)`);
    setTimeout(() => setConnectMessage(''), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderColor: '#334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Compass size={26} style={{ color: '#0ea5e9' }} />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Discover Peer Learning Partners</h1>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
              Search and filter students by what they can teach, what they want to learn, college, and department.
            </p>
          </div>

          <button onClick={fetchDiscoveryData} className="btn btn-outline btn-sm">
            <RefreshCw size={14} /> Refresh Directory
          </button>
        </div>
      </div>

      {connectMessage && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <div>{connectMessage}</div>
        </div>
      )}

      {/* Category Pill Filters Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px', fontSize: '0.825rem' }}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`btn btn-sm ${selectedCategory === cat.name ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '999px', fontSize: '0.825rem', whiteSpace: 'nowrap' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Global Search & Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by student name, skill (e.g. React, Java), or branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <Search size={16} /> Search
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Filter size={14} /> Filter:
            </span>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
            >
              <option value="ALL">All Institutions</option>
              <option value="Malla Reddy University">Malla Reddy University</option>
              <option value="JNTU Hyderabad">JNTU Hyderabad</option>
              <option value="IIT Hyderabad">IIT Hyderabad</option>
            </select>
          </div>
        </form>
      </div>

      {/* Student Discovery Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
          Searching student peer database...
        </div>
      ) : students.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
          <h3>No matching student peers found</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Try clearing search filters or selecting a different skill category.
          </p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#9ca3af' }}>
            Found <strong style={{ color: '#fff' }}>{students.length}</strong> student peer{students.length !== 1 ? 's' : ''} available for skill exchange:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {students.map((student) => (
              <StudentCard key={student.profileId || student.studentId} student={student} onConnect={handleConnect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
