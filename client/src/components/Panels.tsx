/** @jsxImportSource @emotion/react */

import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
// ---
import { LoadingIcon } from "@/components/LoadingIcon";
import { PanelFooter } from "@/components/PanelFooter";
import { RegionsList } from "@/components/RegionsList";
import { RegionsMap } from "@/components/RegionsMap";
import { StatesList } from "@/components/StatesList";
import { StatesMap } from "@/components/StatesMap";
import { UnitConversion } from "@/components/UnitConversion";
import { ImpactsInputs } from "@/components/ImpactsInputs";
import { ImpactsChart } from "@/components/ImpactsChart";
import { ImpactsMessages } from "@/components/ImpactsMessages";
import { ResultsImpactsInputs } from "@/components/ResultsImpactsInputs";
import { PowerEmissionsTable } from "@/components/PowerEmissionsTable";
import { VehiclesEmissionsTable } from "@/components/VehiclesEmissionsTable";
import { StateEmissionsTable } from "@/components/StateEmissionsTable";
import { MonthlyEmissionsCharts } from "@/components/MonthlyEmissionsCharts";
import { COBRAConnection } from "@/components/COBRAConnection";
import { DataDownload } from "@/components/DataDownload";
import { useAppDispatch, useAppSelector } from "@/redux/index";
import {
  setCountiesByRegion,
  selectGeography,
} from "@/redux/reducers/geography";
import {
  setVMTData,
  setHourlyEVChargingPercentages,
} from "@/redux/reducers/transportation";
import {
  useSelectedRegion,
  useSelectedState,
  useSelectedStateRegions,
} from "@/hooks";
import { modalLinkStyles } from "@/utilities";

const Container = styled("div")<{ overlay: boolean }>`
  ${({ overlay }) => {
    if (overlay) {
      return css`
        position: relative;

        &::after {
          content: "";
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.875);
        }
      `;
    }
  }}
`;

const overlayTextStyles = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #00bee6;
  text-align: center;
`;

const panelStyles = css`
  &[data-active="false"] {
    display: none;
  }
`;

const panelBodyStyles = css`
  border-top: 0.375rem solid var(--avert-light-blue);
`;

function ExcelAppText() {
  return (
    <p className="text-base-dark font-sans-2xs tablet:font-sans-xs desktop:font-sans-sm">
      AVERT Web Edition completes analyses using 2023 power sector emissions and
      generation data and AVERT Main Module v4.3. The{" "}
      <a
        className="usa-link"
        href="https://www.epa.gov/avert/download-avert"
        target="_parent"
        rel="noreferrer"
      >
        AVERT Main Module
      </a>{" "}
      v4.3 in Excel allows analyses for years 2017–2023 or for a future year
      scenario.
    </p>
  );
}

function StateGeographyText() {
  return (
    <p className="text-base-dark font-sans-2xs tablet:font-sans-xs desktop:font-sans-sm">
      When modeling energy programs for a single state that is split among
      multiple AVERT regions, AVERT distributes the user-input EE, RE, and EVs
      across all portions of the state. The power sector impacts of these
      programs are assigned to each AVERT region based on the proportional
      generation provided to the state by EGUs in each AVERT region. EV impacts
      are assigned based on the proportion of the state’s vehicle miles traveled
      that occur within each AVERT region, by vehicle type. For more
      information, see Appendix G of the User Manual.
    </p>
  );
}

export function Panels() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCountiesByRegion());
    dispatch(setVMTData());
    dispatch(setHourlyEVChargingPercentages());
  }, [dispatch]);

  const activeStep = useAppSelector(({ panel }) => panel.activeStep);
  const loading = useAppSelector(({ panel }) => panel.loading);
  const cobraApiUrl = useAppSelector(({ api }) => api.cobraApiUrl);
  const geographicFocus = useAppSelector(({ geography }) => geography.focus);
  const hourlyEnergyProfile = useAppSelector(
    ({ impacts }) => impacts.hourlyEnergyProfile,
  );
  const serverCalcError = useAppSelector(
    ({ results }) => results.emissionsChanges.status === "failure",
  );

  const [cobraApiReady, setCobraApiReady] = useState(false);

  useEffect(() => {
    if (activeStep !== 3) return;

    fetch(`${cobraApiUrl}/api/Token`)
      .then((tokenRes) => {
        if (!tokenRes.ok) throw new Error(tokenRes.statusText);
        return tokenRes.json();
      })
      .then(async (tokenData) => {
        const token = tokenData.value;
        const queueRes = await fetch(`${cobraApiUrl}/api/Queue/${token}`);
        if (!queueRes.ok) throw new Error(queueRes.statusText);
        setCobraApiReady(true);
      })
      .catch((error) => {
        console.log(error);
        setCobraApiReady(false);
      });
  }, [activeStep, cobraApiUrl]);

  const selectedRegionName = useSelectedRegion()?.name || "";
  const selectedStateName = useSelectedState()?.name || "";
  const selectedStateRegionNames = useSelectedStateRegions().map((r) => r.name);

  const selectedStateRegions =
    selectedStateRegionNames.length === 1
      ? `${selectedStateRegionNames} Region`
      : `${selectedStateRegionNames.join(", ")} Regions`;

  const geographicLocation =
    geographicFocus === "regions"
      ? `${selectedRegionName} Region`
      : `${selectedStateRegions} (due to changes in ${selectedStateName})`;

  return (
    <Container
      className="border-width-1px border-solid border-base-light"
      overlay={loading || serverCalcError}
    >
      {
        // conditionally display loading indicator
        loading && !serverCalcError && (
          <div css={overlayTextStyles}>
            <LoadingIcon />

            <p className="font-sans-lg text-bold">LOADING...</p>

            {/* conditionally display message for results calculations */}
            {activeStep === 3 && (
              <p className="margin-top-1 font-sans-sm">
                These calculations may take several minutes.
              </p>
            )}
          </div>
        )
      }

      {
        // conditionally display web server error
        serverCalcError && (
          <div css={overlayTextStyles}>
            <p className="font-sans-lg text-bold">Web Server Error</p>

            <p className="margin-top-1 font-sans-sm">
              Please try reloading the page.
            </p>
          </div>
        )
      }

      <section css={panelStyles} data-active={activeStep === 1}>
        <Tab.Group
          selectedIndex={geographicFocus === "regions" ? 0 : 1}
          onChange={(index) => {
            dispatch(selectGeography(index === 0 ? "regions" : "states"));
          }}
        >
          <Tab.List className={clsx("tw-flex tw-justify-between")}>
            {["Select Region", "Select State"].map((tab) => (
              <Tab
                key={tab}
                className={clsx(
                  "tw-w-1/2 tw-cursor-pointer tw-select-none tw-border-x-0 tw-border-b tw-border-t-[6px] tw-border-solid tw-border-b-[#a9aeb1] tw-border-t-[#ccc] tw-bg-neutral-100 tw-px-4 tw-pb-2.5 tw-pt-2 tw-text-base tw-font-bold tw-leading-none tw-text-[#565c65]",
                  "sm:tw-text-lg sm:tw-leading-none",
                  "hover:tw-border-t-[#a9aeb1]",
                  "focus:!tw-outline-none",
                  "focus-visible:tw-relative focus-visible:!tw-outline focus-visible:!tw-outline-[3px] focus-visible:!tw-outline-offset-0 focus-visible:!tw-outline-[#2491ff]",
                  "ui-selected:tw-border-b-white ui-selected:tw-border-t-[--avert-light-blue] ui-selected:tw-bg-white ui-selected:tw-text-[--avert-blue]",
                  "ui-selected:first-of-type:tw-border-r ui-selected:first-of-type:tw-border-r-[#a9aeb1]",
                  "ui-selected:last-of-type:tw-border-l ui-selected:last-of-type:tw-border-l-[#a9aeb1]",
                )}
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className={clsx("tw-p-4")}>
            {[
              <div className="grid-container padding-0 maxw-full">
                <div className="grid-row">
                  <div className="desktop:grid-col-6 desktop:order-last">
                    <div className="padding-x-1">
                      <p className="margin-bottom-0 tablet:margin-top-2 font-sans-xs tablet:font-sans-sm desktop:font-sans-md">
                        AVERT splits the contiguous 48 states into 14
                        independent electricity regions. AVERT regions are
                        organized by one or more balancing authorities. Select a
                        region for analysis by either using the dropdown menus
                        or clicking the map. Selecting a region loads the fossil
                        fuel power plants operating within each region and
                        region-specific wind and solar capacity data.
                      </p>

                      <RegionsList />

                      <div className="display-none desktop:display-block desktop:margin-top-3">
                        <ExcelAppText />
                      </div>
                    </div>
                  </div>

                  <div className="desktop:grid-col-6">
                    <div className="padding-x-1">
                      <RegionsMap />

                      <div className="desktop:display-none">
                        <ExcelAppText />
                      </div>
                    </div>
                  </div>
                </div>
              </div>,

              <div className="grid-container padding-0 maxw-full">
                <div className="grid-row">
                  <div className="desktop:grid-col-6 desktop:order-last">
                    <div className="padding-x-1">
                      <p className="margin-bottom-0 tablet:margin-top-2 font-sans-xs tablet:font-sans-sm desktop:font-sans-md">
                        Select a state for analysis by either using the dropdown
                        menu or clicking the map. Selecting a state means AVERT
                        will load power plants and wind and solar capacity
                        factors for all regions that the state is part of.
                      </p>

                      <StatesList />

                      <div className="display-none desktop:display-block desktop:margin-top-3">
                        <StateGeographyText />
                        <ExcelAppText />
                      </div>
                    </div>
                  </div>

                  <div className="desktop:grid-col-6">
                    <div className="padding-x-1">
                      <StatesMap />

                      <div className="desktop:display-none">
                        <StateGeographyText />
                        <ExcelAppText />
                      </div>
                    </div>
                  </div>
                </div>
              </div>,
            ].map((panel, index) => (
              <Tab.Panel
                key={index}
                className={clsx(
                  "focus:!tw-outline-none",
                  "focus-visible:!tw-outline focus-visible:!tw-outline-[3px] focus-visible:!tw-outline-offset-0 focus-visible:!tw-outline-[#2491ff]",
                )}
              >
                {panel}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>

        <PanelFooter prevButton={null} nextButton="Set Energy Impacts" />
      </section>

      <section css={panelStyles} data-active={activeStep === 2}>
        <div css={panelBodyStyles} className="padding-3 minh-mobile-lg">
          <h2 className="avert-blue margin-bottom-105 padding-bottom-05 border-bottom-2px font-serif-lg">
            Set Energy Scenario
          </h2>

          <h3 className="avert-blue margin-top-0 margin-bottom-1 font-serif-md">
            {geographicFocus === "regions"
              ? `Region: ${selectedRegionName}`
              : `State: ${selectedStateName}`}
          </h3>

          <div className="overflow-hidden">
            <UnitConversion />

            <p className="margin-top-0 font-sans-xs tablet:font-sans-sm desktop:font-sans-md">
              AVERT quantifies changes in electricity generation and emissions
              that result from energy policies and programs. Specify the impacts
              of energy programs below, and AVERT will use these inputs to
              generate results. For more information about inputs, please
              consult the{" "}
              <a
                className="usa-link"
                href="https://www.epa.gov/statelocalenergy/avert-user-manual"
                target="_parent"
                rel="noreferrer"
              >
                AVERT user manual
              </a>{" "}
              or click the &nbsp;
              <span
                css={modalLinkStyles}
                className="position-relative display-inline-block width-2 height-2"
                title="additional information"
              />
              &nbsp; icon for each program type below.
            </p>

            <p className="margin-0 text-base-dark font-sans-2xs tablet:font-sans-xs desktop:font-sans-sm">
              Several types of programs are listed below <em>(A through E)</em>.
              You can enter impacts for any or all types of programs, in any
              combination. AVERT will calculate cumulative impacts.
            </p>
          </div>

          <ImpactsInputs />
          <ImpactsChart />
          <ImpactsMessages />
        </div>

        <PanelFooter prevButton="Back to Geography" nextButton="Get Results" />
      </section>

      <section css={panelStyles} data-active={activeStep === 3}>
        <div css={panelBodyStyles} className="padding-3 minh-mobile-lg">
          <h2 className="avert-blue margin-bottom-105 padding-bottom-05 border-bottom-2px font-serif-lg">
            Regional, State, and County-Level Emissions Changes
          </h2>

          {hourlyEnergyProfile.validation.lowerWarning !== null && (
            <div className="usa-alert usa-alert--warning">
              <div className="usa-alert__body">
                <h4 className="usa-alert__heading">WARNING</h4>
                <p className="usa-alert__text">
                  The proposed energy programs would collectively displace more
                  than 15% of regional fossil generation in one or more hours of
                  the year. AVERT works best with displacements of 15% or less,
                  as it is designed to simulate marginal operational changes in
                  load, rather than large-scale changes that may change
                  fundamental dynamics.
                </p>
              </div>
            </div>
          )}

          <ResultsImpactsInputs />

          <div className="margin-top-3 desktop:display-flex">
            <div className="flex-1 desktop:margin-right-105">
              <h3 className="avert-blue margin-bottom-1 font-serif-md">
                Annual Emissions Changes • <small>Power Sector Only</small>
                <br />
                <span className="display-block margin-top-05 font-serif-xs">
                  {geographicLocation}
                </span>
              </h3>

              <PowerEmissionsTable />
            </div>

            <div className="flex-1 margin-top-3 desktop:margin-left-105 desktop:margin-top-0">
              <h3 className="avert-blue margin-bottom-1 font-serif-md">
                Annual Emissions Changes • <small>Including Vehicles</small>
                <br />
                <span className="display-block margin-top-05 font-serif-xs">
                  {geographicLocation}
                </span>
              </h3>

              <VehiclesEmissionsTable />
            </div>
          </div>

          <div className="margin-top-3">
            <h3 className="avert-blue margin-bottom-1 font-serif-md">
              Annual Emissions Changes By State
              <br />
              <span className="display-block margin-top-05 font-serif-xs">
                {geographicLocation}
              </span>
            </h3>

            <StateEmissionsTable />
          </div>

          <div className="margin-top-3">
            <h3 className="avert-blue margin-bottom-1 font-serif-md">
              Monthly Emission Changes
              <br />
              <span className="display-block margin-top-05 font-serif-sm">
                {geographicLocation}
              </span>
            </h3>

            <MonthlyEmissionsCharts />
          </div>

          <hr className="avert-rule" />

          <div className="grid-container padding-0 maxw-full">
            <div className="grid-row">
              {cobraApiReady ? (
                <>
                  <div className="padding-1 tablet:grid-col-6">
                    <div className="tablet:margin-right-105">
                      <COBRAConnection />
                    </div>
                  </div>

                  <div className="padding-1 tablet:grid-col-6">
                    <div className="margin-top-2 tablet:margin-top-0 tablet:margin-left-105">
                      <DataDownload />
                    </div>
                  </div>
                </>
              ) : (
                <div className="padding-1 margin-x-auto maxw-tablet">
                  <DataDownload />
                </div>
              )}
            </div>
          </div>
        </div>

        <PanelFooter
          prevButton="Back to Energy Impacts"
          nextButton="Reselect Geography"
        />
      </section>
    </Container>
  );
}