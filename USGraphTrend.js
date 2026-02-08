import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { db } from './firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

const USGraphTrend = () => {
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
    const unsub = onSnapshot(doc(db, 'rs_data', 'us_latest'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const rankings = docSnapshot.data().rankings || [];
        const filtered = rankings
          .filter(item => item.rs_avg >= 85)
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

  if (!chartData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>데이터 로딩 중...</Text>
      </View>
    );
  }

  const chartWidth = dimensions.width - 60;
  const chartHeight = 300;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>S&P 500 RS MOMENTUM (US)</Text>

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
        
        {/* 선 끝에 바로 붙는 라벨 */}
        <View style={[styles.labelContainer, { width: chartWidth }]}>
          {stocks.map((stock, idx) => {
            const lastValue = stock.rs_10;
            // 차트 내부 영역 계산
            const chartTop = 40;
            const chartBottom = chartHeight - 40;
            const chartRange = chartBottom - chartTop;
            
            // RS 값을 Y 위치로 변환
            const yPosition = chartTop + chartRange - ((lastValue / 100) * chartRange);
            
            return (
              <View 
                key={stock.code} 
                style={[
                  styles.labelItem,
                  { 
                    top: yPosition - 10,
                    right: 45,
                    backgroundColor: `hsl(${(idx * 360) / stocks.length}, 70%, 50%)`
                  }
                ]}
              >
                <Text style={styles.labelText}>{stock.code}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 범례 */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>RANKING (RS)</Text>
        {stocks.map((stock, idx) => (
          <View key={stock.code} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: `hsl(${(idx * 360) / stocks.length}, 70%, 50%)` }
              ]} 
            />
            <Text style={styles.legendText}>
              {stock.code} ({stock.rs_avg})
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
  chartWrapper: {
    position: 'relative',
    marginHorizontal: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  labelContainer: {
    position: 'absolute',
    top: 8,
    right: 0,
    height: 300,
  },
  labelItem: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  labelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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

export default USGraphTrend;