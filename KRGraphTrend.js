import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { db } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const KRGraphTrend = () => {
  const [chartData, setChartData] = useState(null);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'rs_data', 'latest'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const rankings = docSnapshot.data().rankings || [];
        const filtered = rankings
          .filter(item => item.rs_avg >= 75)
          .sort((a, b) => b.rs_avg - a.rs_avg)
          .slice(0, 5); // 모바일에서는 5개만

        setStocks(filtered);

        // 차트 데이터 준비
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

  if (!chartData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>데이터 로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>KOSPI RS MOMENTUM (KR)</Text>

      {/* 차트 */}
      <LineChart
        data={chartData}
        width={width - 30}
        height={300}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
          },
        }}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        segments={5}
      />

      {/* 범례 */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>RANKING (RS)</Text>
        {stocks.map((stock, idx) => (
          <View key={stock.name} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: `hsl(${(idx * 360) / stocks.length}, 70%, 50%)` }
              ]} 
            />
            <Text style={styles.legendText}>
              {stock.name} ({stock.rs_avg})
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginHorizontal: 15,
  },
  legendContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default KRGraphTrend;
