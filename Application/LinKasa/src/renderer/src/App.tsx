import * as ROUTER from 'react-router-dom'
import LoginForm from './components/LoginForm'
import HRDHome from './components/home/HRDHome'
import JobRegistrantView from './components/view/JobRegistrantView'
import {AddEmployeeView} from './components/view/AddEmployeeView'
import Home from './components/home/Home'
import MaintenanceHome from './components/home/MaintenanceHome'
import CivilEngineerHome from './components/home/CIvilEngineerHome'
import CreateBudgetPlan from './components/view/CreateBudgetPlan'
import ProjectDetail from './components/view/ProjectDetail'
import BaggageSecuritySupervisor_Home from './components/home/BaggageSecuritySupervisorHome'
import ChatHome from "./components/home/ChatHome"
import CreateProject from './components/view/CreateProjectPlan'
import UpdateProjectPlan from './components/view/UpdateProjectPlan'
import ViewEmployee from './components/view/ViewEmployee'
import EmployeeDetail from './components/view/EmployeeDetail'
import ViewTraining from './components/view/ViewTraining'
import LostAndFoundHome from './components/home/LostAndFoundHome'
import CustomerService from './components/home/CustomerService'
import JobVacancyView from './components/view/JobVacancyView'
import { TrainingDetail } from './components/view/TrainingDetail'
import FlightOperationHome from './components/home/FlightOperationHome'
import FlightDetail from './components/view/FlightDetail'
import CargoHome from './components/home/CargoHome'
import LogisticHome from './components/home/LogisticHome'
import LandsideHome from './components/home/LandsideHome'
import Transportation from './components/view/Transportation'
import COOHome from './components/home/COOHome'
import AirportOperationHome from './components/home/AirportOperationHome'
import GroundHandlingHome from './components/home/GroundHandlingHome'
import FuelHome from './components/home/FuelHome'
import CheckInHome from './components/home/CheckInHome'
import CSOHome from './components/home/CSOHome'
import CFOHome from './components/home/CFOHome'
import CEOHome from './components/home/CEOHome'
import CustomsBorderOfficer from './components/home/CustomsBorderOfficer'

function App(): JSX.Element {

  const links:{link:string,view:JSX.Element}[] = [
    {
      link:"/HRD_Home",
      view:<HRDHome></HRDHome>
    },
    {
      link:"/Maintenance_Home",
      view:<MaintenanceHome></MaintenanceHome>
    },
    {
      link:"/GroundHandling_Home",
      view:<GroundHandlingHome></GroundHandlingHome>
    },
    {
      link:"/BaggageSecuritySupervisor_Home",
      view:<BaggageSecuritySupervisor_Home></BaggageSecuritySupervisor_Home>
    },
    {
      link:"/CFO_Home",
      view:<CFOHome></CFOHome>
    },
    {
      link:"/CargoHandling_Home",
      view:<CargoHome></CargoHome>
    },
    {
      link:"/Flight_Operation_Home",
      view:<FlightOperationHome></FlightOperationHome>
    },
    {
      link:"/Airport_Operation_Home",
      view:<AirportOperationHome></AirportOperationHome>
    },
    {
      link:"/CargoHandler_Home",
      view:<CargoHome></CargoHome>
    },
    {
      link:"/Gate_Agent_Home",
      view:<FlightOperationHome></FlightOperationHome>
    },
    {
      link:"/Check-in_Home",
      view:<CheckInHome></CheckInHome>
    },
    {
      link:"/Lost_And_Found_Home",
      view:<LostAndFoundHome></LostAndFoundHome>
    },
    {
      link:"/Information_Desk_Home",
      view:<FlightOperationHome></FlightOperationHome>
    },
    {
      link:"/Customer_Service_Home",
      view:<CustomerService></CustomerService>
    },
    {
      link:"/Landside_Home",
      view:<LandsideHome></LandsideHome>
    },
    {
      link:"/CEO_Home",
      view:<CEOHome></CEOHome> //
    },
    {
      link:"/COO_Home",
      view:<COOHome></COOHome>
    },
    {
      link:"/CSO_Home",
      view:<CSOHome></CSOHome>
    },
    {
      link:"/Customs_And_Border_Home",
      view:<CustomsBorderOfficer></CustomsBorderOfficer> //
    },
    {
      link:"/Logistic_Home",
      view:<LogisticHome></LogisticHome>
    },
    {
      link:"/Fuel_Home",
      view:<FuelHome></FuelHome>
    },
    {
      link:"/CivilEngineer_Home",
      view:<CivilEngineerHome></CivilEngineerHome>
    },
  ]





  window.addEventListener('keydown', (e) => {


        if (e.key == 'r' && e.ctrlKey){

          window.location.href = "/register"
        }
        if (e.key == 'u' && e.ctrlKey){
          window.location.href = "/login_as_user"
        }
        if (e.key == 's' && e.ctrlKey){

          window.location.href = "/login_as_staff"
        }
        if (e.key == 'f' && e.ctrlKey){
          window.location.href = "/chat"
        }
  })

  return (
    <div className="m-0 p-0">
      <ROUTER.Routes>
        <ROUTER.Route path='/' element={<LoginForm></LoginForm>}></ROUTER.Route>
        <ROUTER.Route path='/login_as_user' element={<LoginForm></LoginForm>}></ROUTER.Route>
        <ROUTER.Route path='/login_as_staff' element={<LoginForm></LoginForm>}></ROUTER.Route>
        <ROUTER.Route path='/register' element={<LoginForm></LoginForm>}></ROUTER.Route>
        {links.map((idx,val) => (
          <ROUTER.Route key={val} path = {idx.link} element = {idx.view}></ROUTER.Route>
        ))}
        <ROUTER.Route path ='/chat'  element={<ChatHome></ChatHome>}></ROUTER.Route>
        <ROUTER.Route path ='/flight/:id'  element={<FlightDetail></FlightDetail>}></ROUTER.Route>
        <ROUTER.Route path ='/transportation/:id'  element={<Transportation></Transportation>}></ROUTER.Route>


        {/* HRD */}
        <ROUTER.Route path='/HRD_Home/:success' element={<HRDHome></HRDHome>}></ROUTER.Route>
        <ROUTER.Route path ='/job_registrants'  element={<JobRegistrantView></JobRegistrantView>}></ROUTER.Route>
        <ROUTER.Route path ='/job_registrants/:id'  element={<AddEmployeeView></AddEmployeeView>}></ROUTER.Route>
        <ROUTER.Route path ='/view_employee'  element={<ViewEmployee></ViewEmployee>}></ROUTER.Route>
        <ROUTER.Route path ='/view_employee/:id'  element={<EmployeeDetail></EmployeeDetail>}></ROUTER.Route>
        <ROUTER.Route path ='/job_vacancies/:id'  element={<JobVacancyView></JobVacancyView>}></ROUTER.Route>
        <ROUTER.Route path ='/training_employee'  element={<ViewTraining></ViewTraining>}></ROUTER.Route>
        <ROUTER.Route path ='/training_employee/:id'  element={<TrainingDetail></TrainingDetail>}></ROUTER.Route>

        {/*civil engineering manager*/ }
        <ROUTER.Route path ='/create_budget_plan/:id'  element={<CreateBudgetPlan></CreateBudgetPlan>}></ROUTER.Route>
        <ROUTER.Route path ='/project_detail/:id'  element={<ProjectDetail></ProjectDetail>}></ROUTER.Route>
        <ROUTER.Route path ='/project_detail/:id/:success'  element={<ProjectDetail></ProjectDetail>}></ROUTER.Route>
        <ROUTER.Route path ='/update_budget_plan/:id'  element={<></>}></ROUTER.Route>
        <ROUTER.Route path ='/create_project_plan'  element={<CreateProject></CreateProject>}></ROUTER.Route>
        <ROUTER.Route path ='/update_project_plan/:id'  element={<UpdateProjectPlan></UpdateProjectPlan>}></ROUTER.Route>



      </ROUTER.Routes>
    </div>
  )
}

export default App
