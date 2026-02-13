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
          .sort((a, b) => b.rs_avg - a.rs_avg);

        setStocks(filtered);

        if (filtered.length > 0) {
          const datasets = filtered.map((stock, idx) => ({
            data: [stock.rs_180, stock.rs_90, stock.rs_60, stock.rs_30, stock.rs_10],
            color: () => `hsl(${(idx * 360) / filtered.length}, 70%, 60%)`,
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

  const chartWidth = dimensions.width - 70;
  const chartHeight = 300;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>KOSPI RS MOMENTUM (75+)</Text>
        
        <LineChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            backgroundColor: '#1a1a1a',
            backgroundGradientFrom: '#1a1a1a',
            backgroundGradientTo: '#1a1a1a',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.5})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
            },
            propsForBackgroundLines: {
              stroke: 'rgba(255,255,255,0.1)',
            },
          }}
          bezier
          style={styles.chart}
          withVerticalLines={false}
          segments={5}
          renderDotContent={({ x, y, index, indexData }) => {
            // 마지막 점(10D)에만 라벨 표시
            if (index === 4) {
              const datasetIndex = chartData.datasets.findIndex(ds => 
                ds.data[4] === indexData
              );
              
              if (datasetIndex !== -1 && stocks[datasetIndex]) {
                const stock = stocks[datasetIndex];
                const hue = (datasetIndex * 360) / stocks.length;
                const stockColor = `hsl(${hue}, 70%, 60%)`;
                
                return (
                  <Text
                    key={`label-${datasetIndex}`}
                    style={{
                      position: 'absolute',
                      left: x + 8,
                      top: y - 8,
                      color: stockColor,
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {stock.name}
                  </Text>
                );
              }
            }
            return null;
          }}
        />

        {/* 범례 */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>RS 75+ STOCKS ({stocks.length})</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {stocks.map((stock, idx) => (
              <View key={stock.name} style={styles.legendItem}>
                <View 
                  style={[
                    styles.legendColor, 
                    { backgroundColor: `hsl(${(idx * 360) / stocks.length}, 70%, 60%)` }
                  ]} 
                />
                <Text style={styles.legendText}>
                  {stock.name} ({stock.rs_avg})
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      
      {/* 하단 여백 (스마트폰 네비게이션 바 공간) */}
      <View style={{ height: 80 }} />
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
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b00',
    marginBottom: 20,
    letterSpacing: 1,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  legendContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 12,
    letterSpacing: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
});

export default KRGraphTrend;