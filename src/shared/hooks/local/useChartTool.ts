/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChartStore } from "@/zustand/useChartStore";
import { useCallback } from "react";

export const useChartTools = () => {
  const { chartLoaded, setIsChartReady } = useChartStore();

  const loadSavedTools = async (chart: any) => {
    return new Promise<void>((resolve) => {
      const savedState = localStorage.getItem("chartState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);

        if (typeof chart.setSymbol === "function") {
          try {
            chart.setSymbol(parsedState.symbol, parsedState.interval);
          } catch (error) {
            console.error(error);
          }
        }

        const promises: Promise<void>[] = [];
        parsedState.studies.forEach((study: any) => {
          if (study.name !== "Volume") {
            try {
              promises.push(
                chart.createStudy(
                  study.name,
                  study.forceOverlay,
                  study.lock,
                  study.inputs,
                  study.overrides,
                  study.options
                )
              );
            } catch (error) {
              console.error(error);
            }
          }
        });

        try {
          parsedState.drawings.forEach(
            (
              drawing: {
                points: { price: number; time: number };
                name: string;
              },
              i: number
            ) => {
              if (
                drawing?.points &&
                parsedState?.drawings?.[i]?.symbol === chart.symbol()
              ) {
                // if (Array.isArray(drawing.points)) {
                //   if (drawing.points.length === 0) return
                //   chart.createMultipointShape(drawing.points, drawing.name)
                // } else {
                //   chart.createShape(drawing.points, drawing.name)
                // }
                chart.createMultipointShape(drawing.points, {
                  shape: drawing.name,
                });
              }
            }
          );
        } catch (error) {
          console.error(error);
        }

        Promise.all(promises)
          .then(() => {
            resolve();
            chartLoaded();
          })
          .catch((error) => {
            resolve();
            chartLoaded();
          });
        requestAnimationFrame(() => {
          chartLoaded();
          setIsChartReady();
        });
      } else {
        chartLoaded();
        resolve();
      }
    });
  };

  const saveChartTools = useCallback((chart: any) => {
    const currentSymbol = chart.symbol();
    const currentState: any = {
      drawings: chart.getAllShapes(),
      studies: chart.getAllStudies(),
      interval: chart.resolution(),
    };

    const savedStateString = localStorage.getItem("chartState");
    const savedState = savedStateString
      ? JSON.parse(savedStateString)
      : { drawings: [], studies: [], interval: "" };

    const processDrawings = (drawings: any[]): any[] => {
      return drawings
        .filter(
          (drawing) => drawing.symbol === currentSymbol || !drawing.symbol
        )
        .map((drawing) => {
          const shapeObj = chart.getShapeById(drawing.id);
          if (shapeObj) {
            return {
              id: drawing.id,
              name: drawing.name,
              properties: shapeObj.getProperties(),
              points: shapeObj.getPoints(),
              symbol: drawing.symbol || currentSymbol,
            };
          }
          return null;
        })
        .filter((drawing): drawing is any => drawing !== null);
    };

    const processedCurrentDrawings = processDrawings(currentState.drawings);

    const previousDrawingsWithoutCurrentSymbol = savedState.drawings.filter(
      (drawing: any) => drawing.symbol !== currentSymbol
    );

    const updatedDrawings = [
      ...previousDrawingsWithoutCurrentSymbol,
      ...processedCurrentDrawings,
    ];

    const updateElements = (currentElements: any[], savedElements: any[]) => {
      return currentElements.filter((curr) => {
        if (curr.name === "Volume") return false;
        const existingElement = savedElements.find(
          (saved) => saved.name === curr.name
        );
        if (existingElement) {
          return false;
        }
        return true;
      });
    };

    const updatedState: any = {
      drawings: updatedDrawings,
      studies: updateElements(currentState.studies, savedState.studies),
      interval: currentState.interval,
    };

    const savedDrawingsForCurrentSymbol = savedState.drawings.filter(
      (drawing: any) => drawing.symbol === currentSymbol
    );

    updatedState.studies = [
      ...updatedState.studies,
      ...savedState.studies.filter((s: any) =>
        currentState.studies.some((c: any) => c.name === s.name)
      ),
    ];

    const hasChanges =
      JSON.stringify(processedCurrentDrawings) !==
        JSON.stringify(savedDrawingsForCurrentSymbol) ||
      JSON.stringify(updatedState) !== JSON.stringify(savedState);

    if (hasChanges) {
      localStorage.setItem("chartState", JSON.stringify(updatedState));
    }
  }, []);

  return { loadSavedTools, saveChartTools };
};
