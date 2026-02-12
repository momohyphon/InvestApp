import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { db } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

const KRGraphTrend = () => {
  const [chartData, setChartData] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'rs_data', 'latest'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const rankings = docSnapshot.data().rankings || [];
        const filtered = rankings
          .filter(item => item.rs_avg >= 75)
          .sort((a, b) => b.rs_avg - a.rs_avg)
          .slice(0, 5);

        setStocks(filtered);

        if (filtered.length > 0) {
          const datasets = filtered.map((stock, idx) => ({
            data: [stock.rs_180, stock.rs_90, stock.rs_60, stock.rs_30, stock.rs_10],
            color: () => `hsl(${(idx * 360) / filtered.length}, 70%, 50%)`,
            strokeWidth: 2,
          }));

          setChartData({
            labels: ['180D', '90D', '60D', '30D', '10D'],
            datasets: datasets,
          });
        }
      }
    });
    return () => unsub();
  }, []);

  if (!chartData) return <View style={styles.container}><Text style={styles.loadingText}>데이터 로딩 중...</Text></View>;

  const chartWidth = dimensions.width - 20;
  const chartHeight = 320;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>KOSPI RS MOMENTUM (KR)</Text>

      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: { r: '3', strokeWidth: '1' },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: -30,
          }}
          withVerticalLines={false}
          segments={5}
        />
        
        {/* 종목명을 더 오른쪽으로 */}
        <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
          {stocks.map((stock, idx) => {
            const lastValue = stock.rs_10;
            
            // xPos: 더 오른쪽으로 이동
            const xPos = chartWidth - 70; 
            
            // yPos: 선 끝점의 높이 계산
            const chartTop = 45;
            const chartBottom = chartHeight - 75;
            const chartRange = chartBottom - chartTop;
            const yPos = chartTop + chartRange - ((lastValue / 100) * chartRange);
            
            const stockColor = `hsl(${(idx * 360) / stocks.length}, 70%, 50%)`;
            
            return (
              <View 
                key={stock.name} 
                style={{
                  position: 'absolute',
                  left: xPos, 
                  top: yPos - 8,
                }}
              >
                <Text style={{
                  color: stockColor,
                  fontSize: 11,
                  fontWeight: '900',
                }}>
                  {stock.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>RANKING (RS)</Text>
        {stocks.map((stock, idx) => (
          <View key={stock.name} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: `hsl(${(idx * 360) / stocks.length}, 70%, 50%)` }]} />
            <Text style={styles.legendText}>{stock.name} ({stock.rs_avg})</Text>
          </View>
        ))}
        <View style={{ height: 60 }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingText: { color: '#fff', textAlign: 'center', padding: 20 },
  title: { fontSize: 18, fontWeight: '900', color: '#000', backgroundColor: '#fff', padding: 15, marginBottom: 20 },
  chartWrapper: { position: 'relative', marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 16, overflow: 'visible' },
  legendContainer: { backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 10, marginBottom: 30 },
  legendTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, textDecorationLine: 'underline' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  legendColor: { width: 15, height: 15, borderRadius: 3, marginRight: 10 },
  legendText: { fontSize: 13, fontWeight: '600' },
});

export default KRGraphTrend;