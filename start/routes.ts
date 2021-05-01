import Route from '@ioc:Adonis/Core/Route'

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.get('/me', 'AuthController.me').middleware('auth')
Route.patch('/patchme', 'AuthController.patchme').middleware('auth')
Route.patch('/patchadmin', 'AuthController.patchAdmin').middleware('auth')

Route.post('/forgot', 'ForgotsController.forgot')
Route.patch('/reset', 'ForgotsController.reset')

Route.post('/newexam', 'ExamsController.NewExam').middleware('auth')
Route.delete('/delexam/:id', 'ExamsController.DelExam').middleware('auth')
Route.get('/listexam', 'ExamsController.ListExam').middleware('auth')

Route.post('/newquetion', 'QuestionsController.NewQuestion').middleware('auth')
Route.delete('/deletequetion/:id', 'QuestionsController.DeleteQuestion').middleware('auth')
Route.get('/selectquestion/:id', 'QuestionsController.SelectQuestion').middleware('auth')

Route.get('/listallquestion', 'QuestionsController.ListAllQuestion')

Route.post('/xlsx', 'QuestionsController.XlsxUploadQuestion').middleware('auth')

Route.get('/allenem', 'EnemsController.AllEnem').middleware('auth')

Route.post('/newtypesimulate', 'SimuladosController.createTypes').middleware('auth')
Route.delete('/deltypesimulate/:id', 'SimuladosController.delTypes').middleware('auth')
Route.get('/listtypesimulate', 'SimuladosController.listTypes').middleware('auth')

Route.post('/newsimulate', 'SimuladosController.createSimulado').middleware('auth')
Route.get('/callsimulate/:id', 'SimuladosController.callSimulate').middleware('auth')
Route.post('/answersimulate', 'SimuladosController.answersimulate').middleware('auth')
