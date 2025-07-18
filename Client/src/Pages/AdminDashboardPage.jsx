import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from '../api/axiosInstance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f7f'];

const AdminDashboardPage = () => {
  const { firebaseToken } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data } = await axios.get('/admin/overview', {
          headers: { Authorization: `Bearer ${firebaseToken}` }
        });
        setOverview(data);
      } catch (err) {
        console.error('Dashboard fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    if (firebaseToken) fetchOverview();
  }, [firebaseToken]);

  const orderStatusData = overview?.orderStatusBreakdown || [];

  return (
    <AdminLayout>
      <Container fluid>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <h3 className="mb-4 text-center">📊 Admin Dashboard Overview</h3>
            <Row className="mb-4 text-center">
              <Col md={3}><Card body><h5>Total Orders</h5><h4>{overview.totalOrders}</h4></Card></Col>
              <Col md={3}><Card body><h5>Total Revenue</h5><h4>₹{overview.totalRevenue}</h4></Card></Col>
              <Col md={3}><Card body><h5>Total Users</h5><h4>{overview.totalUsers}</h4></Card></Col>
              <Col md={3}><Card body><h5>Total Menu Items</h5><h4>{overview.totalMenuItems}</h4></Card></Col>
            </Row>

            <Row>
              <Col md={6}>
                <Card body>
                  <h6 className="text-center">📌 Order Status Breakdown</h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col md={6}>
                <Card body>
                  <h6 className="text-center">📈 Revenue Metrics</h6>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { name: 'Orders', value: overview.totalOrders },
                      { name: 'Revenue', value: overview.totalRevenue },
                      { name: 'Users', value: overview.totalUsers },
                      { name: 'Items', value: overview.totalMenuItems },
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
